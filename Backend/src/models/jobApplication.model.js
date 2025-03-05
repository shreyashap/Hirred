import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    jobPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job post reference is required"],
    },
    applicantFullName: {
      type: String,
      required: [true, "Applicant first name is required"],
    },
    applicantEmail: {
      type: String,
      required: [true, "Applicant email is required"],
      match: [/.+@.+\..+/, "Please fill a valid email address"],
    },
    resume: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
    },
    mobileNo: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid mobile number"],
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Interviewing", "Accepted", "Rejected"],
      default: "Pending",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    appliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const JobApplication = mongoose.model(
  "JobApplication",
  jobApplicationSchema
);
