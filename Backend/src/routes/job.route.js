import {
  createJob,
  getAllJobs,
  getSingleJob,
  getJobByCompany,
  getJobByCompanyAndJobId,
  deleteJob,
  searchJob,
  filterJob,
  saveUnsaveJob,
  getSavedJobs,
} from "../controllers/job.controller.js";
import { verifyRecruiter } from "../middlewares/admin.middleware.js";
import { verifyIsApplicant } from "../middlewares/applicant.middleware.js";
import { verifyJWt } from "../middlewares/auth.middleware.js";
import express from "express";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router
  .route("/post-job")
  .post(upload.single("companyLogo"), verifyJWt, verifyRecruiter, createJob);
router.route("/jobs/").get(verifyJWt, getAllJobs);
router.route("/get-job/:id").get(verifyJWt, getSingleJob);
router
  .route("/get-job-company/:id")
  .get(verifyJWt, verifyRecruiter, getJobByCompany);

router.route("/delete-job/:jobId").post(verifyJWt, verifyRecruiter, deleteJob);
router
  .route("/get-applicants/:jobId")
  .get(verifyJWt, verifyRecruiter, getJobByCompanyAndJobId);

router.route("/search-jobs/").get(verifyJWt, verifyIsApplicant, searchJob);
router.route("/filter-jobs/").get(verifyJWt, verifyIsApplicant, filterJob);

router
  .route("/save-unsave-job/:jobId")
  .get(verifyJWt, verifyIsApplicant, saveUnsaveJob);

router.route("/saved-jobs").get(verifyJWt, verifyIsApplicant, getSavedJobs);

export default router;
