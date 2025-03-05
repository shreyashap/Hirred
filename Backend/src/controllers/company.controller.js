import { Company } from "../models/company.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { companySchema } from "../schemas/companySchema.js";
import {
  uploadOnCloudinary,
  deleteOnCloudinary,
} from "../utils/uploadCloudinary.js";

const registerCompany = asyncHandler(async (req, res) => {
  const validatedData = companySchema.safeParse(req?.body);
  const file = req.file;

  const user = req.user;

  if (!user) {
    return res.status(403).json({
      errorMsg: "Unatuthorized request",
    });
  }

  if (!file?.path) {
    return res.status(403).json({
      errorMsg: "Missing File: Logo",
    });
  }

  if (!validatedData.success) {
    const errorMessages = validatedData.error.errors.map((err) => err.message);
    return res.status(403).json({ success: false, errorMsg: errorMessages });
  }

  const { companyName, companyDescription, location, website } =
    validatedData.data;

  const isCompanyExist = await Company.find({
    companyName: { $regex: new RegExp(companyName.toLocaleLowerCase(), "i") },
  });

  if (isCompanyExist && isCompanyExist.length > 0) {
    return res.status(401).json({
      errorMsg: "Compnay is registered with this name",
    });
  }

  const cloudinaryRes = await uploadOnCloudinary(file.path, "Hirred/Company");

  if (!cloudinaryRes) {
    return res.status(500).json({
      errorMsg: "Failed to upload a file",
    });
  }

  const logo = cloudinaryRes;

  const company = await Company.create({
    companyName,
    companyDescription,
    companyLogo: logo,
    location,
    website,
    createdBy: user._id,
  });

  if (!company._id) {
    return res.status(500).json({
      errorMsg: "Error while creating company",
    });
  }

  res.status(201).json({
    message: "Company created successfully",
  });
});

const getAllCompanies = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      error: "Unauthorized request",
    });
  }

  const companies = await Company.find({
    createdBy: user._id,
  }).lean();

  if (!companies) {
    return res.status(500).json({
      errorMsg: "Failed to get the comapny details",
    });
  }

  res.status(200).json({
    companies,
    message: "Successfully fetched all companies",
  });
});

const updateCompanyDetails = asyncHandler(async (req, res) => {
  const { companyId } = req.params;

  if (!companyId) {
    return res.status(401).json({
      error: "Unauthorized request",
    });
  }

  const company = await Company.findById(companyId);

  if (!company) {
    return res.status(404).json({
      error: "Company not found",
    });
  }

  const { companyName, description, location, website } = req.body;
  const file = req.file;

  if (company.companyLogo && file) {
    const publicId = company.companyLogo.split("/").pop().split("?")[0];

    if (!publicId) return;

    const [deleteResult, uploadResult] = await Promise.all([
      deleteOnCloudinary(`Hirred/Company/${publicId}`),
      uploadOnCloudinary(file.path, "Hirred/Company"),
    ]);

    if (!uploadResult) {
      return res.status(500).json({
        errorMsg: "Failed to update the company logo",
      });
    }

    company.companyLogo = uploadResult;
  }

  if (companyName) {
    const company = await Company.find(
      {
        companyName: {
          $regex: new RegExp(companyName.toLocaleLowerCase(), "i"),
        },
      },
      {
        companyName: 1,
      }
    ).lean();

    if (company && company.length > 0) {
      return res.status(403).json({
        errorMsg: "Compnay is registered with this name",
      });
    }
  }

  (company.companyName = companyName || company.companyName),
    (company.companyDescription = description || company.companyDescription),
    (company.location = location || company.location),
    (company.website = website || company.website);

  const updatedCompanyDetails = await company.save({
    validateBeforeSave: false,
  });

  if (!updatedCompanyDetails) {
    return res.status(500).json({
      errorMsg: "Failed to update details",
    });
  }

  res.status(201).json({
    updatedCompanyDetails,
    message: "Details updated successfully",
  });
});

const deleteCompany = asyncHandler(async (req, res) => {
  const { companyId } = req.params;

  if (!companyId) {
    return res.status(401).json({
      error: "Unauthorized request",
    });
  }

  const company = await Company.findById(companyId);

  if (!company) {
    return res.status(404).json({
      error: "Company not found",
    });
  }

  if (company.companyLogo) {
    const publicId = company.companyLogo.split("/").pop().split("?")[0];

    if (!publicId) return;

    const deleteResult = await deleteOnCloudinary(`Hirred/Company/${publicId}`);

    if (!deleteResult) {
      return res.status(500).json({
        errorMsg: "Failed to delete",
      });
    }

    const result = await Company.findByIdAndDelete(companyId);
  }

  res.status(200).json({
    message: "Company profile deleted successfully",
  });
});

const getCompanyNames = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      error: "Unauthorized request",
    });
  }

  const company = await Company.find(
    { createdBy: user._id },
    { companyName: 1 }
  ).lean();

  if (!company) {
    if (!user) {
      return res.status(500).json({
        error: "Failed to get company details",
      });
    }
  }

  res.status(200).json({
    company,
    message: "Company details",
  });
});

const getAllCompanyNames = asyncHandler(async (req, res) => {
  const company = await Company.find().lean().select("companyName");

  if (!company) {
    return res.status(500).json({
      errorMsg: "No data found",
    });
  }

  res.status(200).json({
    company,
    message: "Companies",
  });
});

export {
  registerCompany,
  getAllCompanies,
  updateCompanyDetails,
  deleteCompany,
  getCompanyNames,
  getAllCompanyNames,
};
