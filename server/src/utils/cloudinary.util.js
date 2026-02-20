import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload Image to Cloudinary (From Local Path)
 */
export const uploadOnCloudinary = async (localFilePath, folder = "general") => {
  try {
    if (!localFilePath) return null;

    // Upload
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: `campusbite/${folder}`,
      resource_type: "auto",
    });

    // Clean up local file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return {
      url: response.secure_url,
      publicId: response.public_id,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message);
    // Clean up local file on error
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

/**
 * Delete Image from Cloudinary
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Delete Error:", error.message);
    return null;
  }
};