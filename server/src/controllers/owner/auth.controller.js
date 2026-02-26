import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { 
  ownerRegisterService, 
  ownerLoginService, 
  verifyOtpService, 
  resendOtpService,
  markOwnerEmailVerifiedService 
} from "../../services/auth.service.js";

// Register Owner (Triggers OTP Email automatically via Service)
export const registerOwner = asyncHandler(async (req, res) => {
  const firebaseUid = req.user?.firebaseUid || req.firebaseUid || req.user?.uid; 
  if (!firebaseUid) throw new ApiError(401, "Firebase Authentication failed");

  const dataToProcess = { ...req.body };
  
  // If Multer uploaded an image, attach its local path for cloudinary upload inside service  
  if (req.file) dataToProcess.image = req.file.path; 

  const newOwner = await ownerRegisterService(firebaseUid, dataToProcess);
  return res.status(201).json(new ApiResponse(201, newOwner, "Registration successful. OTP sent to email."));
});

// Verify Email & OTP
export const verifyOwnerEmail = asyncHandler(async (req, res) => {
  const firebaseUid = req.user?.firebaseUid || req.firebaseUid || req.user?.uid; 
  const email = req.user?.email; 
  const { otp } = req.body; 

  if (!firebaseUid || !email) throw new ApiError(401, "Firebase Authentication failed");
  if (!otp) throw new ApiError(400, "OTP is required");

  // 1. Verify OTP mathematically
  await verifyOtpService(email, otp);

  // 2. Mark Verified in DB via Service (Strict MVC followed)
  await markOwnerEmailVerifiedService(firebaseUid);

  return res.status(200).json(new ApiResponse(200, null, "Email successfully verified."));
});

// Resend OTP
export const resendOtp = asyncHandler(async (req, res) => {
  const email = req.user?.email;
  if (!email) throw new ApiError(401, "Firebase Authentication failed");
  
  await resendOtpService(email);
  return res.status(200).json(new ApiResponse(200, null, "OTP has been resent to your email."));
});

// Login Owner
export const loginOwner = asyncHandler(async (req, res) => {
  const firebaseUid = req.user?.firebaseUid || req.firebaseUid || req.user?.uid; 
  if (!firebaseUid) throw new ApiError(401, "Firebase Authentication failed");

  const ownerData = await ownerLoginService(firebaseUid);
  return res.status(200).json(new ApiResponse(200, ownerData, "Owner logged in successfully"));
});

// Quick Auth Profile check
export const getOwnerProfile = asyncHandler(async (req, res) => {
  const owner = req.user; 
  if (!owner) throw new ApiError(404, "Owner not found");
  return res.status(200).json(new ApiResponse(200, owner, "Owner profile fetched successfully"));
});