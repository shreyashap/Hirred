import express from "express";
import {
  applyToJob,
  updateJobStatus,
  updateJobActiveStatus,
  searchApplicants,
  getMyApplications,
} from "../controllers/application.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWt } from "../middlewares/auth.middleware.js";
import { verifyRecruiter } from "../middlewares/admin.middleware.js";
import { verifyIsApplicant } from "../middlewares/applicant.middleware.js";

const router = express.Router();

router
  .route("/apply-job/:jobId")
  .post(upload.single("resume"), verifyJWt, verifyIsApplicant, applyToJob);

router
  .route("/update-job-status")
  .post(verifyJWt, verifyRecruiter, updateJobStatus);

router
  .route("/update-active-status/:jobId")
  .post(verifyJWt, verifyRecruiter, updateJobActiveStatus);

router
  .route("/search-applications")
  .post(verifyJWt, verifyRecruiter, searchApplicants);

router
  .route("/my-applications")
  .get(verifyJWt, verifyIsApplicant, getMyApplications);

export default router;
