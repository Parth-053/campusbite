import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { 
  getOwnerProfileService, 
  updateOwnerProfileService, 
  softDeleteOwnerProfileService,
  getCanteenByOwnerIdService 
} from "../../services/profile.service.js";

// 🚀 FIXED: Corrected the filename from "cloudinary.js" to "cloudinary.util.js"
import { uploadOnCloudinary } from "../../utils/cloudinary.util.js"; 
import { v2 as cloudinary } from "cloudinary"; 

export const getOwnerProfile = asyncHandler(async (req, res) => {
  const profileData = await getOwnerProfileService(req.user._id);
  return res.status(200).json(new ApiResponse(200, profileData, "Owner profile fetched successfully"));
});

export const updateOwnerProfile = asyncHandler(async (req, res) => {
  let imagePath = null; 
  
  if (req.file) {
    // 1. Get existing canteen data to check for old image
    const existingCanteen = await getCanteenByOwnerIdService(req.user._id);
    
    // 2. Upload new image
    const cloudinaryRes = await uploadOnCloudinary(req.file.path);
    
    if (cloudinaryRes) {
      imagePath = cloudinaryRes.url; 
      
      // 3. Delete old image from Cloudinary if it exists
      if (existingCanteen && existingCanteen.image) {
         try {
           const oldImageUrl = existingCanteen.image;
           // Extract Public ID
           const publicId = oldImageUrl.split('/').pop().split('.')[0]; 
           if (publicId) await cloudinary.uploader.destroy(publicId);
         } catch (error) { 
           console.log("Failed to delete old image", error); 
         }
      }
    }
  }
  
  const updatedProfile = await updateOwnerProfileService(req.user._id, req.body, imagePath);
  return res.status(200).json(new ApiResponse(200, updatedProfile, "Owner profile updated successfully"));
});

export const softDeleteOwnerProfile = asyncHandler(async (req, res) => {
  await softDeleteOwnerProfileService(req.user._id);
  return res.status(200).json(new ApiResponse(200, null, "Account successfully deleted"));
});