import { ApiError } from "../utils/ApiError.js";

/**
 * Middleware to validate Request Body using Joi
 * @param {Object} schema - Joi Schema Object
 */
const validate = (schema) => (req, res, next) => {
  // 'abortEarly: false' ensures we get ALL errors, not just the first one
  const { error, value } = schema.validate(req.body, { 
    abortEarly: false, 
    stripUnknown: true // Remove fields not present in schema
  });

  if (error) {
    // Extract error messages into a clean array
    const errors = error.details.map((detail) => detail.message.replace(/"/g, ''));
    
    // Throw 422 (Unprocessable Entity)
    return next(new ApiError(422, "Validation Error", errors));
  }

  // Replace req.body with sanitized value (converted types, defaults applied)
  req.body = value;
  next();
};

export default validate;