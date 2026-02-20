/**
 * Higher-Order Function to handle Async Errors
 * Wraps async functions and passes errors to the next middleware
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };