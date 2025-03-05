import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    rqeuired: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    rqeuired: true,
    lowercase: true,
  },
  password: {
    type: String,
    rqeuired: true,
  },
  accountType: {
    type: String,
    rqeuired: true,
  },
  profileImg: {
    type: String,
    default: "",
  },
  mobileNo: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  accessToken: {
    type: String,
  },
  skills: {
    type: String,
  },
  savedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  preferences: {
    type: Object,
    default: {},
  },
  googleRefreshToken: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: String,
  },
});

export const User = mongoose.model("User", userSchema);
