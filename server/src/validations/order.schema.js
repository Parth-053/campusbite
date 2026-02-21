import Joi from "joi";
import { MONGO_ID_REGEX } from "../constants/regex.js";
import { ORDER_STATUS } from "../constants/orderStatus.js";

export const createOrderSchema = Joi.object({
  canteen: Joi.string().pattern(MONGO_ID_REGEX).required(),
  items: Joi.array().items(
    Joi.object({
      menuItem: Joi.string().pattern(MONGO_ID_REGEX).required(),
      name: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      price: Joi.number().positive().required(),
    })
  ).min(1).required(),
  totalAmount: Joi.number().positive().required(),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid(
    ORDER_STATUS.PENDING, 
    ORDER_STATUS.PREPARING, 
    ORDER_STATUS.READY, 
    ORDER_STATUS.COMPLETED, 
    ORDER_STATUS.CANCELLED
  ).required(),
});

// For Razorpay signature validation & transaction logging
export const verifyPaymentSchema = Joi.object({
  orderId: Joi.string().pattern(MONGO_ID_REGEX).required(),
  razorpayOrderId: Joi.string().required(),
  razorpayPaymentId: Joi.string().required(),
  razorpaySignature: Joi.string().required(),
  amount: Joi.number().positive().required(),
});