import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { 
  getOwnerProfileService, 
  updateOwnerProfileService, 
  softDeleteOwnerProfileService 
} from "../../services/profile.service.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.util.js"; 

// Get Complete Profile Data (Owner + Canteen Details)
export const getOwnerProfile = asyncHandler(async (req, res) => {
  const profileData = await getOwnerProfileService(req.user._id);
  return res.status(200).json(new ApiResponse(200, profileData, "Owner profile fetched successfully"));
});

// Update Profile & Canteen Details
export const updateOwnerProfile = asyncHandler(async (req, res) => {
  let imagePath = null; 
  
  // Handing Image upload securely via Cloudinary utility before saving to DB
  if (req.file) {
    const cloudinaryRes = await uploadOnCloudinary(req.file.path, "profile");
    if (cloudinaryRes) {
      imagePath = cloudinaryRes.url; 
    }
  }
  
  // Calling the service (Safe MVC logic)
  const updatedProfile = await updateOwnerProfileService(req.user._id, req.body, imagePath);
  return res.status(200).json(new ApiResponse(200, updatedProfile, "Owner profile updated successfully"));
});

// Soft Delete / Close Account
export const softDeleteOwnerProfile = asyncHandler(async (req, res) => {
  await softDeleteOwnerProfileService(req.user._id);
  return res.status(200).json(new ApiResponse(200, null, "Owner account securely deleted and store closed."));
});