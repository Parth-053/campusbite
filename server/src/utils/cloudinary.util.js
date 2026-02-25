import cloudinary from "../config/cloudinary.js";  
import fs from "fs/promises";  

/**
 * Upload Image to Cloudinary  
 */
export const uploadOnCloudinary = async (localFilePath, folder = "general") => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: `campusbite/${folder}`, 
      resource_type: "auto",
    });
 
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
 * Delete Image from Cloudinary (Smartly handles both publicId and full URL)
 */
export const deleteFromCloudinary = async (imageUrlOrPublicId) => {
  try {
    if (!imageUrlOrPublicId) return null;
    
    let publicId = imageUrlOrPublicId;
 
    if (imageUrlOrPublicId.startsWith('http')) {
      const urlParts = imageUrlOrPublicId.split('/');
      const filenameWithExt = urlParts.pop();  
      const folder2 = urlParts.pop();  
      const folder1 = urlParts.pop();  
      const filename = filenameWithExt.split('.')[0];  
       
      publicId = `${folder1}/${folder2}/${filename}`;
    }

    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Delete Error:", error.message);
    return null;
  }
};