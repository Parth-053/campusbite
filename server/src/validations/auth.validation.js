import Joi from "joi";
import { EMAIL_REGEX, MOBILE_REGEX, UPI_REGEX, MONGO_ID_REGEX } from "../constants/regex.js";

export const registerOwnerSchema = Joi.object({
  personal: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required(),
    lastName: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().pattern(EMAIL_REGEX).required(),
    mobile: Joi.string().pattern(MOBILE_REGEX).required(),
  }).required(),
  
  payment: Joi.object({
    upiId: Joi.string().pattern(UPI_REGEX).required().messages({
      "string.pattern.base": "Invalid UPI ID format (e.g., user@bank)",
    })
  }).required(),

  canteen: Joi.object({
    canteenName: Joi.string().trim().required(),
    state: Joi.string().required(),
    district: Joi.string().required(),
    college: Joi.string().required(),
    type: Joi.string().valid("central", "hostel").required(),
    hostelId: Joi.string().allow("", null).optional(),
    openingTime: Joi.string().required(), 
    closingTime: Joi.string().required(),
    allowedHostels: Joi.array().items(Joi.string()).optional(),
  }).required()
});

export const registerCustomerSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),
  email: Joi.string().pattern(EMAIL_REGEX).required(),
  phone: Joi.string().pattern(MOBILE_REGEX).required(),
  college: Joi.string().pattern(MONGO_ID_REGEX).allow("", null).optional().messages({ "string.pattern.base": "Invalid College ID" }),
  hostel: Joi.string().pattern(MONGO_ID_REGEX).required().messages({ "string.pattern.base": "Invalid Hostel ID" }),
  roomNo: Joi.string().trim().optional().allow(""),
});

export const registerAdminSchema = Joi.object({
  firebaseUid: Joi.string().required(),
  name: Joi.string().trim().min(3).max(50).required(),
  email: Joi.string().pattern(EMAIL_REGEX).required(),
});