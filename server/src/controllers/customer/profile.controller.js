import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.util.js";
import { 
  getCustomerProfileService, 
  updateCustomerProfileService,
  softDeleteCustomerProfileService 
} from "../../services/profile.service.js";

// ==========================================
// Fetch Customer Profile
// ==========================================
export const getCustomerProfile = asyncHandler(async (req, res) => {
  const customerId = req.user.uid || req.user._id; 
  
  const profileData = await getCustomerProfileService(customerId);
  return res.status(200).json(new ApiResponse(200, profileData, "Customer profile fetched successfully"));
});

// ==========================================
// Update Customer Profile
// ==========================================
export const updateCustomerProfile = asyncHandler(async (req, res) => {
  const customerId = req.user.uid || req.user._id;
  
  let imageUrl = null;
  if (req.file) {
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (uploadResult) {
      imageUrl = uploadResult.secure_url;
    }
  }

  const updatedProfile = await updateCustomerProfileService(customerId, req.body, imageUrl);
  return res.status(200).json(new ApiResponse(200, updatedProfile, "Customer profile updated successfully"));
});

// ==========================================
// Soft Delete Customer Profile
// ==========================================
export const deleteCustomerProfile = asyncHandler(async (req, res) => {
  const customerId = req.user.uid || req.user._id;
  
  await softDeleteCustomerProfileService(customerId);
  return res.status(200).json(new ApiResponse(200, null, "Customer profile deleted successfully"));
});