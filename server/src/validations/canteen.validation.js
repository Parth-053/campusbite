import Joi from "joi";
import { MONGO_ID_REGEX, GSTIN_REGEX } from "../constants/regex.js";

export const createCanteenSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),
  college: Joi.string().pattern(MONGO_ID_REGEX).required(),
  openingTime: Joi.string().pattern(/^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/).required().messages({
    "string.pattern.base": "Time must be in format 'HH:MM AM/PM' (e.g., 09:00 AM)"
  }),
  closingTime: Joi.string().pattern(/^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/).required(),
  gstin: Joi.string().pattern(GSTIN_REGEX).optional().allow(""),
  allowedHostels: Joi.array().items(Joi.string().trim()).optional().default([]),
});

export const updateCanteenStatusSchema = Joi.object({
  isOpen: Joi.boolean().required(),
});

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  canteen: Joi.string().pattern(MONGO_ID_REGEX).required(),
});