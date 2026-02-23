import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { 
  sendCustomerOtpService, 
  verifyOtpService, 
  customerRegisterService, 
  customerLoginService 
} from "../../services/auth.service.js";

export const sendCustomerOtp = asyncHandler(async (req, res) => {
  const { email, name } = req.body;
  await sendCustomerOtpService(email, name);
  return res.status(200).json(new ApiResponse(200, null, "OTP sent successfully"));
});

export const verifyCustomerOtpOnly = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  await verifyOtpService(email, otp);
  return res.status(200).json(new ApiResponse(200, null, "OTP verified successfully"));
});

export const registerCustomer = asyncHandler(async (req, res) => {
  const customerData = { ...req.body, firebaseUid: req.user.uid };
  const newCustomer = await customerRegisterService(customerData);
  return res.status(201).json(new ApiResponse(201, newCustomer, "Customer registered and verified successfully"));
});

export const loginCustomer = asyncHandler(async (req, res) => {
  const customerData = await customerLoginService(req.user.uid);
  return res.status(200).json(new ApiResponse(200, customerData, "Customer logged in successfully"));
});