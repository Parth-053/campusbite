import Razorpay from "razorpay";
import { envConfig } from "./env.config.js";

export const razorpay = (envConfig.razorpay.keyId && envConfig.razorpay.keySecret)
  ? new Razorpay({
      key_id: envConfig.razorpay.keyId,
      key_secret: envConfig.razorpay.keySecret,
    })
  : null;