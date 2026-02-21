import Joi from "joi";
import { MONGO_ID_REGEX } from "../constants/regex.js";

export const addToCartSchema = Joi.object({
  canteen: Joi.string().pattern(MONGO_ID_REGEX).required(), // To ensure user orders from one canteen at a time
  menuItem: Joi.string().pattern(MONGO_ID_REGEX).required(),
  name: Joi.string().required(),
  price: Joi.number().positive().required(),
  quantity: Joi.number().integer().min(1).max(50).required(), // Max 50 items at a time to prevent overload
});

export const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).max(50).required(),
});