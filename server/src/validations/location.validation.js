import Joi from "joi";
import { MONGO_ID_REGEX } from "../constants/regex.js";

export const createStateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
});

export const createDistrictSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  state: Joi.string().pattern(MONGO_ID_REGEX).required(),
});

export const createCollegeSchema = Joi.object({
  name: Joi.string().trim().min(5).max(100).required(),
  district: Joi.string().pattern(MONGO_ID_REGEX).required(),
});