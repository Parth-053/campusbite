import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { customerRegisterService, customerLoginService } from "../../services/auth.service.js";

export const registerCustomer = asyncHandler(async (req, res) => {
  const customerData = { ...req.body, firebaseUid: req.user.uid };
  const newCustomer = await customerRegisterService(customerData);
  return res.status(201).json(new ApiResponse(201, newCustomer, "Customer registered successfully"));
});

export const loginCustomer = asyncHandler(async (req, res) => {
  const customerData = await customerLoginService(req.user.firebaseUid);
  return res.status(200).json(new ApiResponse(200, customerData, "Customer logged in successfully"));
});