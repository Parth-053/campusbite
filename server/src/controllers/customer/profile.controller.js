import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { getCustomerProfileService, updateCustomerProfileService } from "../../services/profile.service.js";

// Fetch Customer Profile
export const getCustomerProfile = asyncHandler(async (req, res) => {
  const profileData = await getCustomerProfileService(req.user._id);
  return res.status(200).json(new ApiResponse(200, profileData, "Customer profile fetched successfully"));
});

// Update Customer Profile
export const updateCustomerProfile = asyncHandler(async (req, res) => {
  const updatedProfile = await updateCustomerProfileService(req.user._id, req.body);
  return res.status(200).json(new ApiResponse(200, updatedProfile, "Customer profile updated successfully"));
});