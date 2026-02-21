import Joi from "joi";
import { EMAIL_REGEX, MOBILE_REGEX, UPI_REGEX, MONGO_ID_REGEX } from "../constants/regex.js";

export const registerOwnerSchema = Joi.object({
  firebaseUid: Joi.string().required().messages({ "any.required": "Firebase UID is required" }),
  name: Joi.string().trim().min(3).max(50).required(),
  email: Joi.string().pattern(EMAIL_REGEX).required(),
  phone: Joi.string().pattern(MOBILE_REGEX).required(),
  upiId: Joi.string().pattern(UPI_REGEX).required().messages({
    "string.pattern.base": "Invalid UPI ID format (e.g., user@bank)",
  })
});

export const registerCustomerSchema = Joi.object({
  firebaseUid: Joi.string().required(),
  name: Joi.string().trim().min(3).max(50).required(),
  email: Joi.string().pattern(EMAIL_REGEX).required(),
  phone: Joi.string().pattern(MOBILE_REGEX).required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  academicYear: Joi.number().integer().min(1).max(5).required(), // E.g., Year 1 to 5
  college: Joi.string().pattern(MONGO_ID_REGEX).required().messages({ "string.pattern.base": "Invalid College ID" }),
  hostel: Joi.string().trim().optional().allow(""),
  roomNo: Joi.string().trim().optional().allow(""),
});

export const registerAdminSchema = Joi.object({
  firebaseUid: Joi.string().required(),
  name: Joi.string().trim().min(3).max(50).required(),
  email: Joi.string().pattern(EMAIL_REGEX).required(),
});