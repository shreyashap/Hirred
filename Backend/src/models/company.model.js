import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    companyLogo: {
      type: String,
      required: true,
    },
    companyDescription: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Company = mongoose.model("Company", companySchema);
