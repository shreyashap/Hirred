import { User } from "../models/user.model.js";
import { hashPassword, isPasswordCorrect } from "../utils/hashPassword.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  userRegisteartionSchema,
  userLoginSchema,
  forgetPasswordSchema,
  updatePasswordSchema,
} from "../schemas/user.schema.js";

import crypto from "crypto";
import { oauth2Client } from "../utils/oauth2Client.js";

import { generateAccessToken } from "../utils/generateToken.js";

import { sendEmail } from "../utils/emailService.js";

import axios from "axios";

import { client } from "../client.js";

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
};

const registerUser = asyncHandler(async (req, res) => {
  const accountType = req.query.accountType;

  if (accountType !== "applicant" && accountType !== "recruiter") {
    return res
      .status(400)
      .json({ success: false, error: "Invalid account type" });
  }

  const validatedData = userRegisteartionSchema.safeParse(req?.body);

  if (!validatedData.success) {
    const errorMessages = validatedData.error.errors.map((err) => err.message);
    return res.status(401).json({ success: false, error: errorMessages });
  }

  const { firstName, lastName, email, password, mobileNo, country, bio } =
    validatedData.data;

  const userExist = await User.findOne({ email });
  if (userExist) {
    return res
      .status(401)
      .json({ success: false, error: "User is already registered" });
  }

  const hashedPassword = await hashPassword(password);
  if (!hashedPassword) {
    return res.status(500).json({ success: false, error: "Server error" });
  }

  const newUser = await User.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPassword,
    accountType,
    mobileNo,
    country,
    bio,
  });

  const user = await User.findById(newUser._id).select(
    "-password -accessToken"
  );
  if (!user) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to register" });
  }
  await user.save();

  res.status(200).json({
    message: "User registeration successfull",
    user,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const validatedData = userLoginSchema.parse(req.body);

  const user = await User.findOne({ email: validatedData?.email });
  if (!user) {
    return res.status(400).json({ error: "User is not registered" });
  }

  const isPassCorrect = await isPasswordCorrect(
    validatedData?.password,
    user.password
  );

  if (!isPassCorrect) {
    return res.status(404).json({ error: "Invalid credentials" });
  }

  const accessToken = await generateAccessToken(user._id);

  if (!accessToken) {
    return res.status(500).json({ error: "Error in generating accessToken" });
  }

  user.accessToken = accessToken;
  await user.save({ validateBeforeSave: false });

  const loggedInUser = await User.findById(user._id).select("-password");

  res.status(200).cookie("accessToken", accessToken, options).json({
    message: "User logged In successfully",
    loggedInUser,
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        accessToken: "",
      },
    },
    {
      new: true,
    }
  );

  res.status(200).clearCookie("accessToken", options).json({
    message: "Logout successfull",
  });
});

const googleAuth = asyncHandler(async (req, res) => {
  const code = req?.query.code;
  const accountType = req?.query.accountType;

  const googleRes = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(googleRes.tokens);

  const userRes = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
  );

  const user = await User.findOne({ email: userRes.data.email }).select(
    "-password -resetPasswordToken -resetPasswordExpires"
  );

  if (!user) {
    newUser = await User.create({
      firstName: userRes.data.given_name,
      lastName: userRes.data.family_name,
      email: userRes.data.email,
      profileImg: userRes.data.picture,
      accountType,
    });

    const token = await generateAccessToken(newUser?._id);
    newUser.accessToken = token;
    await newUser.save({ validateBeforeSave: false });

    const createdUser = {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      accessToken: newUser.accessToken,
      preferences: newUser.preferences,
      profileImg: newUser.profileImg,
    };

    res.status(200).cookie("accessToken", accessToken, options).json({
      message: "User login successfull",
      createdUser,
    });
  }

  const accessToken = await generateAccessToken(user._id);
  user.accessToken = accessToken;
  await user.save({ validateBeforeSave: false });

  res.status(200).cookie("accessToken", accessToken, options).json({
    message: "User login successfull",
    user,
  });
});

const requestPasswordReset = asyncHandler(async (req, res) => {
  const validatedData = forgetPasswordSchema.parse(req?.body);

  const user = await User.findOne({ email: validatedData.email }).select(
    "email"
  );
  if (!user) {
    return res.status(400).json({ errorMsg: "Invalid email address" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto
    .createHmac("sha256", process.env.RESET_PASSWORD_SECRET)
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpires = Date.now() + 1200000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

  const emailResponse = await sendEmail(
    user.email,
    "Reset Password",
    "This is a password reset link",
    resetUrl
  );

  res.status(200).json({
    success: true,
    message: "Password reset link sent",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const token = req.params.token;

  const validatedData = updatePasswordSchema.parse(req.body);

  const resetTokenHash = crypto
    .createHmac("sha256", process.env.RESET_PASSWORD_SECRET)
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetTokenHash,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(404).json({
      error: "Invalid or expired token",
    });
  }

  const hashedPassword = await hashPassword(validatedData.newPassword);

  user.password = hashedPassword;
  (user.resetPasswordToken = ""), (user.resetPasswordExpires = "");
  await user.save({ validateBeforeSave: false });

  await user.save({
    validateBeforeSave: false,
  });

  res.status(200).json({
    message: "Password has been reset",
  });
});

const getUser = asyncHandler(async (req, res) => {
  const userId = req?.user._id;
  const cachedValue = await client.get(`user:${userId}`);

  if (cachedValue) {
    return res.status(200).json({
      user: JSON.parse(cachedValue),
    });
  }

  const user = await User.findById(userId).select("-password -accessToken");
  if (!user) {
    return res.status(404).json({
      error: "Unauthorized request",
    });
  }

  await client.set(`user:${userId}`, JSON.stringify(user));
  await client.expire(`user:${userId}`, 60 * 15);

  res.status(200).json({
    message: "User details",
    user,
  });
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { firstName, lastName, mobileNo, country, skills, bio, preferences } =
    req.body;

  const updatedFields = {
    ...(firstName !== undefined && { firstName }),
    ...(lastName !== undefined && { lastName }),
    ...(mobileNo !== undefined && { mobileNo }),
    ...(country !== undefined && { country }),
    ...(skills !== undefined && { skills }),
    ...(bio !== undefined && { bio }),
    ...(preferences !== undefined && { preferences }),
  };

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updatedFields },
    { new: true, runValidators: true, select: "-password" } // Return updated user without password
  ).lean();

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  await client.del(`user:${userId}`);

  res.status(200).json({
    message: "success",
    user,
  });
});

export {
  registerUser,
  loginUser,
  logoutUser,
  googleAuth,
  requestPasswordReset,
  resetPassword,
  getUser,
  updateUserDetails,
};
