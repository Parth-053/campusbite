import Joi from "joi";
import { MONGO_ID_REGEX } from "../constants/regex.js";

export const createMenuSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  price: Joi.number().positive().min(1).required().messages({
    "number.min": "Price must be at least Rs 1",
  }),
  type: Joi.string().valid('veg', 'non-veg').default('veg'),
  isAvailable: Joi.boolean().default(true),
  category: Joi.string().pattern(MONGO_ID_REGEX).required(),
  canteen: Joi.string().pattern(MONGO_ID_REGEX).required(),
});

export const updateMenuSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  price: Joi.number().positive().min(1).optional(),
  type: Joi.string().valid('veg', 'non-veg').optional(),
  isAvailable: Joi.boolean().optional(),
});