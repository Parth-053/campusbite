import { logger } from "../config/logger.js";

/**
 * Middleware to log HTTP requests
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Once the response is finished, log the details
  res.on("finish", () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    if (res.statusCode >= 400) {
      logger.error(message);
    } else {
      logger.info(message);
    }
  });

  next();
};