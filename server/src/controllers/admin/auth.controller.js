import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { adminLoginService } from "../../services/auth.service.js";

export const loginAdmin = asyncHandler(async (req, res) => {
  const adminData = await adminLoginService(req.user.firebaseUid);
  return res.status(200).json(new ApiResponse(200, adminData, "Admin logged in successfully"));
});