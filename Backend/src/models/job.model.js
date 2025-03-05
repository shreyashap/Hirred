import mongoose, { mongo } from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    companyLogo: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      required: [true, "Employment type is required"],
    },
    jobType: {
      type: String,
      enum: ["remote", "in-office", "hybrid"],
      required: [true, "Employment type is required"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tags: {
      type: [String],
      required: true,
      validate: function (value) {
        return value.length <= 5;
      },
      messages: "tags cannot have more than 5 keywords",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model("Job", jobSchema);
