import cloudinary from "../config/cloudinary.js";  
import fs from "fs/promises";  

/**
 * Upload Image to Cloudinary (From Local Path)
 */
export const uploadOnCloudinary = async (localFilePath, folder = "general") => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: `campusbite/${folder}`,
      resource_type: "auto",
    });

    // Asynchronously delete local file
    await fs.unlink(localFilePath).catch(err => console.error("Error deleting local file:", err));

    return {
      url: response.secure_url,
      publicId: response.public_id,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message);
    
    if (localFilePath) {
      await fs.unlink(localFilePath).catch(err => console.error("Error deleting local file after failure:", err));
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