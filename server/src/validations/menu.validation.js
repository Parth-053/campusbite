import Joi from 'joi';
 
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const createMenuSchema = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    price: Joi.number().required().min(0),
    category: Joi.string()
      .regex(objectIdPattern)
      .message('Invalid category ID format')
      .required(),
    isNonVeg: Joi.boolean().default(false), 
    isAvailable: Joi.boolean().default(true),
  }),
};

export const updateMenuSchema = {
  body: Joi.object().keys({
    name: Joi.string().trim(),
    price: Joi.number().min(0),
    category: Joi.string()
      .regex(objectIdPattern)
      .message('Invalid category ID format'),
    isNonVeg: Joi.boolean(), 
    isAvailable: Joi.boolean(),
  }).min(1),  
};