import { ApiError } from "../utils/ApiError.js";

/**
 * Middleware to strictly validate Request Body using Joi
 * @param {Object} schema - Joi Schema Object
 */
const validate = (schema) => (req, res, next) => {
  // SECURITY: stripUnknown removes any malicious injected fields not in our schema
  const { error, value } = schema.validate(req.body, { 
    abortEarly: false, 
    stripUnknown: true 
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message.replace(/"/g, ''));
    throw new ApiError(422, "Data Validation Failed", errors);
  }

  // Replace req.body with 100% sanitized and safe data
  req.body = value;
  next();
};

export default validate;