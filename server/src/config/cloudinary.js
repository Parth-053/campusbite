import { v2 as cloudinary } from "cloudinary";
import { envConfig } from "./env.config.js";

cloudinary.config({
  cloud_name: envConfig.cloudinary.cloud_name,
  api_key: envConfig.cloudinary.api_key,
  api_secret: envConfig.cloudinary.api_secret,
});

export { cloudinary };