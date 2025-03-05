import { Job } from "../models/job.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Company } from "../models/company.model.js";
import { jobSchema } from "../schemas/job.schema.js";
import { JobApplication } from "../models/jobApplication.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { client } from "../client.js";

const createJob = asyncHandler(async (req, res) => {
  const user = req.user;

  const tags = req.body?.tags ? JSON.parse(req.body.tags) : [];

  const company = req.body?.company;

  if (!company || company === "Create One") {
    return res.status(403).json({
      errorMsg: "Company is required",
    });
  }

  if (!tags || tags.length > 5) {
    return res.status(403).json({
      errorMsg: "tags is required | maximum 5 tags",
    });
  }

  const validatedData = jobSchema.safeParse(req.body);

  if (!validatedData.success) {
    const errMsg = validatedData.error.errors.map((err) => err.message);
    return res.status(401).json({ success: false, error: errMsg });
  }

  const companyDeatils = await Company.findOne({ companyName: company }).lean();

  if (!companyDeatils) {
    return res.status(500).json({
      errorMsg: "Failed to get company details",
    });
  }

  const newJob = {
    title: validatedData.data.title,
    description: validatedData.data.description,
    location: validatedData.data.jobLocation,
    companyName: companyDeatils.companyName,
    companyLogo: companyDeatils.companyLogo || "",
    jobType: validatedData.data.jobType,
    employmentType: validatedData.data.employmentType,
    company: companyDeatils._id,
    postedBy: user._id,
    tags,
  };

  const job = new Job(newJob);
  await job.save({ validateBeforeSave: false });

  const isJobCreted = await Job.findById(job._id);
  if (!isJobCreted) {
    return res.status(504).json({
      error: "Failed to post a job",
    });
  }

  res.status(200).json({
    message: "Job posted successfully",
    job: newJob,
  });
});

const getAllJobs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;

  const limit = 6;
  const skip = (page - 1) * limit;

  const jobs = await Job.find().skip(skip).limit(limit).sort({ createdAt: -1 });

  const totalJobs = await Job.countDocuments();

  res.status(200).json({
    success: true,
    totalJobs,
    totalPages: Math.ceil(totalJobs / limit),
    currentPage: page,
    jobs,
  });
});

const getSingleJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(401).json({
      error: "Unauthorized request",
    });
  }

  const job = await Job.findById(id);

  if (!job) {
    return res.status(404).json({
      error: "Job not found",
    });
  }

  const isApplied = job.applicants.includes(req.user._id);
  // console.log(isApplied);

  res.status(200).json({
    message: "Job fecthed successfully",
    job,
    isApplied,
  });
});

const getJobByCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const recruiterId = req.user._id;
  if (!id) {
    return res.status(404).json({
      errorMsg: "Job not found",
    });
  }

  const jobs = await Job.find({
    company: id,
    postedBy: recruiterId,
  }).lean();

  if (!jobs) {
    return res.status(500).json({
      errorMsg: "Jobs not found",
    });
  }

  res.status(200).json({
    message: "Successfull",
    jobs,
  });
});

const getJobByCompanyAndJobId = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const id = req.user._id;

  if (!jobId) return;

  const job = await Job.findById(jobId).lean();
  if (!job || !job?.isActive) {
    return res.status(404).json({
      errorMsg: "Job not found",
    });
  }

  if (job.postedBy.toString() !== id.toString()) {
    return res.status(401).json({
      error: "Unauthorized request",
    });
  }

  const applications = await JobApplication.find({
    jobPost: jobId,
  })
    .populate("appliedBy")
    .lean()
    .select("-password");

  res.status(200).json({
    message: "success",
    applications,
  });
});

const deleteJob = async (req, res) => {
  const { jobId } = req.params;
  const session = await mongoose.startSession();

  try {
    if (!jobId) {
      return res.status(404).json({
        errorMsg: "Not found",
      });
    }

    session.startTransaction();

    const job = await Job.findById(jobId).session(session);
    if (!job) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Job not found" });
    }

    const [deletedApplications, deletedJob] = await Promise.all([
      JobApplication.deleteMany({ jobPost: jobId }).session(session),
      Job.findByIdAndDelete(jobId).session(session),
    ]);

    if (!deletedJob && deletedApplications) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({
        success: false,
        message: "Failed yo delete the job",
      });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Job and its applications deleted successfully.",
      deletedApplications: deletedApplications.deletedCount,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error deleting job applications:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting job applications.",
      error: error.message,
    });
  }
};

const searchJob = asyncHandler(async (req, res) => {
  const search = req.query.search;

  const cacheKey = `search_jobs:${JSON.stringify(search.toLowerCase())}`;

  const cachedResult = await client.get(cacheKey);

  if (cachedResult) {
    console.log("Returning cached data");
    return res.status(200).json({
      jobs: JSON.parse(cachedResult),
    });
  }

  if (!search) {
    return res.status(404).json({
      error: "Not found",
    });
  }

  const jobs = await Job.find({
    title: { $regex: new RegExp(search), $options: "i" },
  }).lean();

  if (!jobs) {
    return res.status(403).json({
      errorMsg: "jobs not found",
    });
  }

  client.setEx(cacheKey, 900, JSON.stringify(jobs));

  res.status(200).json({
    message: "success",
    jobs,
  });
});
const filterJob = asyncHandler(async (req, res) => {
  const { location, company, employment, job } = req.query;

  // if (!location || company || employment || job) {
  //   return res.status(404).json({
  //     error: "Not found",
  //   });
  // }

  const filter = {};

  if (location) {
    filter.location = { $regex: new RegExp(location, "i") };
  }
  if (company) filter.companyName = company;
  if (employment) filter.employmentType = employment;
  if (job) filter.jobType = job;

  const jobs = await Job.find(filter).lean();

  if (!jobs) {
    return res.status(403).json({
      errorMsg: "jobs not found",
    });
  }

  res.status(200).json({
    message: "success",
    jobs,
  });
});

const saveUnsaveJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user._id;

  const job = await Job.findById(jobId).select("_id savedBy");
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  const user = await User.findById(userId).select("savedJobs");

  const isAlreadySaved = user.savedJobs.indexOf(jobId);
  const savedUserIndex = job.savedBy.indexOf(userId);

  if (isAlreadySaved !== -1 && savedUserIndex !== -1) {
    user.savedJobs.splice(isAlreadySaved, 1);
    job.savedBy.splice(savedUserIndex, 1);
  } else {
    user.savedJobs.push(jobId);
    job.savedBy.push(userId);
  }

  await Promise.all([
    user.save({ validateBeforeSave: false }),
    job.save({ validateBeforeSave: false }),
  ]);

  res.status(200).json({
    message:
      isAlreadySaved !== -1
        ? "Job unsaved successfully"
        : "Job saved successfully",
  });
});

const getSavedJobs = asyncHandler(async (req, res) => {
  const savedJobs = await User.findById(req.user._id)
    .populate("savedJobs")
    .lean()
    .select("savedJobs");
  if (!savedJobs) {
    return res.status(404).json({
      errorMsg: "Saved jobs not found",
    });
  }

  res.status(200).json({
    message: "success",
    savedJobs,
  });
});

export {
  createJob,
  getAllJobs,
  getSingleJob,
  getJobByCompany,
  deleteJob,
  getJobByCompanyAndJobId,
  searchJob,
  filterJob,
  saveUnsaveJob,
  getSavedJobs,
};
