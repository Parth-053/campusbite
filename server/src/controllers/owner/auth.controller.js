import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ownerRegisterService, ownerLoginService } from "../../services/auth.service.js";

export const registerOwner = asyncHandler(async (req, res) => {
  // In a real flow, firebaseUid comes from verifyToken middleware mapping, or body if registering
  const ownerData = { ...req.body, firebaseUid: req.user.uid }; 
  const newOwner = await ownerRegisterService(ownerData);
  return res.status(201).json(new ApiResponse(201, newOwner, "Owner registered successfully. Pending Admin approval."));
});

export const loginOwner = asyncHandler(async (req, res) => {
  const ownerData = await ownerLoginService(req.user.firebaseUid);
  return res.status(200).json(new ApiResponse(200, ownerData, "Owner logged in successfully"));
});