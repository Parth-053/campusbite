import { ApiError } from "../utils/ApiError.js";

/**
 * Securely handles undefined routes without revealing server structure
 */
export const notFound = (req, res, next) => {
  const error = new ApiError(404, `The requested endpoint [${req.method}] ${req.originalUrl} does not exist on this server.`);
  next(error);
};