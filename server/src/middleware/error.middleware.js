import { envConfig } from "../config/env.config.js";
import { logger } from "../config/logger.js";

export const globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  // MongoDB Duplicate Key Error (e.g., Email already exists)
  if (err.code === 11000) {
    statusCode = 409;
    message = `Duplicate value entered for field: ${Object.keys(err.keyValue).join(', ')}`;
  }

  // MongoDB ObjectId Cast Error
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ID format for ${err.path}`;
  }

  // SECURITY: Log the actual error internally, but don't send stack trace to users in Production
  logger.error(`[${req.method}] ${req.originalUrl} >> Status: ${statusCode} | Msg: ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
    // Stack trace is strictly hidden in production
    stack: envConfig.env === "development" ? err.stack : undefined,
  });
};