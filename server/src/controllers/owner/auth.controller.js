import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { 
  ownerRegisterService, 
  ownerLoginService, 
  verifyOtpService, 
  resendOtpService 
} from "../../services/auth.service.js";
import Owner from "../../models/Owner.js";

export const registerOwner = asyncHandler(async (req, res) => {
  const firebaseUid = req.user?.firebaseUid || req.firebaseUid || req.user?.uid; 
  if (!firebaseUid) throw new ApiError(401, "Firebase Authentication failed");

  const dataToProcess = { ...req.body };
  if (req.file) dataToProcess.image = req.file.path; 

  const newOwner = await ownerRegisterService(firebaseUid, dataToProcess);
  return res.status(201).json(new ApiResponse(201, newOwner, "Registration successful. OTP sent to email."));
});

export const verifyOwnerEmail = asyncHandler(async (req, res) => {
  const firebaseUid = req.user?.firebaseUid || req.firebaseUid || req.user?.uid; 
  const email = req.user?.email; 
  const { otp } = req.body; 

  if (!firebaseUid || !email) throw new ApiError(401, "Firebase Authentication failed");
  if (!otp) throw new ApiError(400, "OTP is required");

  await verifyOtpService(email, otp);

  // Still safe to have this 1 line here as it's specifically part of marking user as verified post-registration
  const owner = await Owner.findOneAndUpdate({ firebaseUid }, { isVerified: true }, { new: true });
  if (!owner) throw new ApiError(404, "Owner not found");

  return res.status(200).json(new ApiResponse(200, null, "Email successfully verified."));
});

//  STRICT ARCHITECTURE: DB query removed. Uses Service directly.
export const resendOtp = asyncHandler(async (req, res) => {
  const email = req.user?.email;
  if (!email) throw new ApiError(401, "Firebase Authentication failed");
  
  // Directly let the service handle the database check and email sending
  await resendOtpService(email);
  
  return res.status(200).json(new ApiResponse(200, null, "OTP has been resent to your email."));
});

export const loginOwner = asyncHandler(async (req, res) => {
  const firebaseUid = req.user?.firebaseUid || req.firebaseUid || req.user?.uid; 
  if (!firebaseUid) throw new ApiError(401, "Firebase Authentication failed");

  const ownerData = await ownerLoginService(firebaseUid);
  return res.status(200).json(new ApiResponse(200, ownerData, "Owner logged in successfully"));
});

export const getOwnerProfile = asyncHandler(async (req, res) => {
  const owner = req.user; 
  if (!owner) throw new ApiError(404, "Owner profile not found");
  return res.status(200).json(new ApiResponse(200, owner, "Profile fetched successfully"));
});