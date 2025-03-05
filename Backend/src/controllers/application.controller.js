import { asyncHandler } from "../utils/asyncHandler.js";
import { JobApplication } from "../models/jobApplication.model.js";
import { Job } from "../models/job.model.js";
import { jobApplicationSchema } from "../schemas/jobApplicationShema.js";
import { uploadOnCloudinary } from "../utils/uploadCloudinary.js";
import { model } from "../utils/geminiConfig.js";

import removeMarkdown from "remove-markdown";
import extractTextFromPDF from "../utils/resumeParser.js";

export const applyToJob = asyncHandler(async (req, res) => {
  const validateSchema = jobApplicationSchema.safeParse(req.body);

  const file = req.file;
  const { jobId } = req.params;

  if (!jobId) {
    return res.status(403).json({
      errorMsg: "Invalid request",
    });
  }

  if (!file?.path) {
    return res.status(403).json({
      errorMsg: "Missing File: Resume",
    });
  }

  if (!validateSchema.success) {
    const errorMessages = validateSchema.error.errors.map((err) => err.message);
    return res.status(403).json({ success: false, errorMsg: errorMessages });
  }

  const { fullName, email, mobileNo, coverLetter } = validateSchema.data;

  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({ success: false, errorMsg: "Job not found" });
  }

  if (!job.isActive) {
    return res
      .status(404)
      .json({ success: false, errorMsg: "This job no longer exist" });
  }

  const jobApplication = await JobApplication.findOne({
    appliedBy: req.user._id,
  });

  if (jobApplication) {
    return res
      .status(404)
      .json({ success: false, errorMsg: "You have already applied" });
  }

  const [jobDescription, resumeText] = await Promise.all([
    removeMarkdown(job.description),
    extractTextFromPDF(file.path),
  ]);

  if (!jobDescription || !resumeText) {
    return res.status(500).json({
      errorMsg: "Failed to parse resume",
    });
  }

  const prompt = `Act as a HR Manager with 20 years of experience.
  Compare the resume provided below with the job description given below.
  Check for key skills in the resume that are related to the job description.
  Rate the resume out of 100 based on the matching skill set.
  Assess the score with high accuracy.
  Here is the Resume text: ${resumeText}
  Here is the Job Description: ${jobDescription}
  I want the response as a single string in the following structure score:`;

  const [result, cloudinaryRes] = await Promise.all([
    model.generateContent(prompt),
    uploadOnCloudinary(file.path, "Hirred/JobApplications"),
  ]);

  if (!result || !result.response) {
    return res
      .status(500)
      .json({ error: "Failed to generate content from model" });
  }

  if (!cloudinaryRes) {
    return res.status(500).json({ errorMsg: "Failed to upload resume" });
  }

  const response = result.response.text();

  const score = response.split(":").pop().trim();

  const application = await JobApplication.create({
    jobPost: jobId,
    applicantFullName: fullName,
    applicantEmail: email,
    resume: cloudinaryRes,
    mobileNo,
    coverLetter: coverLetter || "",
    appliedBy: req.user._id,
    score: Number(score),
  });

  if (!application._id) {
    return res.status(504).json({
      errorMsg: "Failed to apply for this job",
    });
  }

  const appliedJob = await Job.findById(jobId);
  appliedJob.applicants.push(req.user._id);

  appliedJob.save({ validateBeforeSave: false });

  res.status(201).json({
    message: "Successfully applied",
  });
});

export const updateJobActiveStatus = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { activeStatus } = req.body;

  if (!jobId) return;

  if (!activeStatus) {
    return res.status(403).json({
      errorMsg: "Updated status is required",
    });
  }

  const id = req.user._id;

  const job = await Job.findById(jobId);

  if (!job) {
    return res.status(404).json({
      errorMsg: "Job not found",
    });
  }

  if (job.postedBy.toString() !== id.toString()) {
    return res.status(401).json({
      error: "Unauthorized request",
    });
  }

  if (activeStatus === "Open") {
    job.isActive = true;
  } else if (activeStatus === "Closed") {
    job.isActive = false;
  }

  await job.save({ validateBeforeSave: false });

  res.status(200).json({
    message: "Job Active status updated successfully",
  });
});
export const updateJobStatus = asyncHandler(async (req, res) => {
  const jobId = req.query.jobId;
  const applicationId = req.query.applicationId;

  const { newStatus } = req.body;

  if (!newStatus) {
    return res.status(403).json({
      errorMsg: "Updated status is required",
    });
  }

  const id = req.user._id;

  if (!jobId || !applicationId) {
    return res.status(401).json({
      error: "JobID and applicationId missing",
    });
  }

  const job = await Job.findById(jobId).lean();

  if (!job) {
    return res.status(404).json({
      errorMsg: "Job not found",
    });
  }

  if (!job.isActive) {
    return res.status(403).json({
      errorMsg: "Job is closed",
    });
  }

  if (job.postedBy.toString() !== id.toString()) {
    return res.status(401).json({
      error: "Unauthorized request",
    });
  }

  const application = await JobApplication.findById(applicationId);
  if (!application) {
    return res.status(403).json({
      error: "Application not found",
    });
  }
  application.status = newStatus;
  await application.save({ validateBeforeSave: false });

  res.status(200).json({
    message: "Status updated successfully",
  });
});

export const searchApplicants = asyncHandler(async (req, res) => {
  const { search, id } = req.query;
  const data = req.body;

  // if (!search || !score) {
  //   return res.status(401).json({
  //     error: "Unauthorized request",
  //   });
  // }

  let scoreFilter = {};
  if (data.score === "Above 90") {
    scoreFilter = { score: { $gte: 90 } };
  } else if (data.score === "Between 70 & 90") {
    scoreFilter = { score: { $gte: 70, $lt: 90 } };
  } else if (data.score === "Below 70") {
    scoreFilter = { score: { $lt: 70 } };
  } else {
    scoreFilter = {};
  }

  const applications = await JobApplication.find({
    applicantFullName: { $regex: new RegExp(search), $options: "i" },
    jobPost: id,
    ...scoreFilter,
  });

  if (!applications) {
    return res.status(500).json({
      errorMsg: "Applications not found",
    });
  }

  res.status(200).json({
    message: "success",
    applications,
  });
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const applications = await JobApplication.find({
    appliedBy: userId,
  })
    .lean()
    .select("-score");

  if (!applications) {
    return res.status(404).json({
      error: "Applications not found",
    });
  }

  res.status(200).json({
    message: "success",
    applications,
  });
});
