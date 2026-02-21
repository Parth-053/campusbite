import { logger } from "../config/logger.js";

/**
 * Middleware to securely log HTTP requests
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    // Log basic info without exposing req.body payload (which might contain passwords)
    const message = `${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms - IP: ${req.ip}`;

    if (res.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.info(message);
    }
  });

  next();
};