import { verifyRecruiter } from "../middlewares/admin.middleware.js";
import { verifyJWt } from "../middlewares/auth.middleware.js";
import express from "express";
import {
  registerCompany,
  getAllCompanies,
  updateCompanyDetails,
  deleteCompany,
  getCompanyNames,
  getAllCompanyNames,
} from "../controllers/company.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router
  .route("/register-company")
  .post(
    upload.single("companyLogo"),
    verifyJWt,
    verifyRecruiter,
    registerCompany
  );

router.route("/get-companies").get(verifyJWt, verifyRecruiter, getAllCompanies);
router
  .route("/get-companyNames")
  .get(verifyJWt, verifyRecruiter, getCompanyNames);
router.route("/get-all-companies").get(verifyJWt, getAllCompanyNames);

router
  .route("/update-company-details/:companyId")
  .post(
    upload.single("logo"),
    verifyJWt,
    verifyRecruiter,
    updateCompanyDetails
  );

router
  .route("/delete-company/:companyId")
  .post(verifyJWt, verifyRecruiter, deleteCompany);

export default router;
