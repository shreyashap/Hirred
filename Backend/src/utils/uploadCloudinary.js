import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import "../config.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (filePath, folderName, fileType) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
      resource_type: "auto",
    });

    const optimizeUrl = await cloudinary.url(uploadResult.public_id, {
      fetch_format: "auto",
      quality: "auto",
    });

    if (optimizeUrl) {
      fs.unlink(filePath, (err) => {
        if (err) throw err;
        console.log("file deleted");
      });
    }

    return optimizeUrl;
  } catch (error) {
    console.error("Failed to upload file", error);
    fs.unlink(filePath, (err) => {
      if (err) throw err;
      console.log("file deleted");
    });
    return null;
  }
};

export const deleteOnCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });

    console.log(result);
    return result;
  } catch (error) {
    console.error("Failed to delete file", error);
  }
};
