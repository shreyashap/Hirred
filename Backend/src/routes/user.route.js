import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  googleAuth,
  requestPasswordReset,
  resetPassword,
  getUser,
  updateUserDetails,
} from "../controllers/user.controller.js";
import { verifyJWt } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWt, logoutUser);
router.route("/request-reset-password").post(requestPasswordReset);
router.route("/reset-password/:token").patch(resetPassword);
router.route("/get-user").get(verifyJWt, getUser);
router.route("/auth-google").get(googleAuth);
router.route("/update-user-details").patch(verifyJWt, updateUserDetails);

export default router;
