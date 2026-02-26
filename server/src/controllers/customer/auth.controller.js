import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { 
  sendCustomerOtpService, 
  customerRegisterService, 
  customerLoginService, 
  verifyOtpService 
} from "../../services/auth.service.js";

export const sendCustomerOtp = asyncHandler(async (req, res) => {
  const { email, name } = req.body;
  if (!email) throw new ApiError(400, "Email is required");
  
  await sendCustomerOtpService(email, name || "User");
  return res.status(200).json(new ApiResponse(200, null, "OTP sent to your email."));
});

export const verifyCustomerOtpOnly = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) throw new ApiError(400, "Email and OTP are required");
  
  await verifyOtpService(email, otp);
  return res.status(200).json(new ApiResponse(200, null, "OTP verified successfully."));
});

export const registerCustomer = asyncHandler(async (req, res) => {
  const firebaseUid = req.user?.firebaseUid || req.firebaseUid || req.user?.uid;
  if (!firebaseUid) throw new ApiError(401, "Firebase Authentication failed");
  
  const newCustomer = await customerRegisterService({ ...req.body, firebaseUid });
  return res.status(201).json(new ApiResponse(201, newCustomer, "Customer registered successfully."));
});

export const loginCustomer = asyncHandler(async (req, res) => {
  const firebaseUid = req.user?.firebaseUid || req.firebaseUid || req.user?.uid;
  if (!firebaseUid) throw new ApiError(401, "Firebase Authentication failed");
  
  const customerData = await customerLoginService(firebaseUid);
  return res.status(200).json(new ApiResponse(200, customerData, "Customer logged in successfully"));
});