const Joi = require('joi');

// NOTE: There may be an additional field like NAME_USER
const registerUserSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.base': `{{#label}} should be a type of string`,
    'string.empty': `{{#label}} must contain value`,
    'string.email':
      '{{#label}} must be contain symbol @ and look like "jekie@gmail.com"',
    'any.required': `{{#label}} is a required field`,
  }),
  password: Joi.string()
    .trim()
    .min(6)
    .regex(/^[a-zA-Z0-9]{6,30}$/)
    .required()
    .messages({
      'string.base': `{{#label}} should be a type of string`,
      'string.pattern.base':
        '{{#label}} with value {:[.]} fails. Password should be between 6 to 30 characters and contain letters or numbers only',
      'string.empty': `{{#label}} must contain value`,
      'string.min': `{{#label}} should have a minimum length of 6`,
      'any.required': `{{#label}} is a required field`,
    }),
})
  .required()
  .messages({
    'any.required': `missing fields`,
  });

// Schema for login user
const loginUserSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.base': `{{#label}} should be a type of string`,
    'string.empty': `{{#label}} must contain value`,
    'string.email':
      '{{#label}} must be contain symbol @ and look like "jekie@gmail.com"',
    'any.required': `{{#label}} is a required field`,
  }),
  password: Joi.string()
    .trim()
    .min(6)
    .regex(/^[a-zA-Z0-9]{6,30}$/)
    .required()
    .messages({
      'string.base': `{{#label}} should be a type of string`,
      'string.pattern.base':
        '{{#label}} with value {:[.]} fails. Password should be between 6 to 30 characters and contain letters or numbers only',
      'string.empty': `{{#label}} must contain value`,
      'string.min': `{{#label}} should have a minimum length of 6`,
      'any.required': `{{#label}} is a required field`,
    }),
})
  .required()
  .messages({
    'any.required': `missing fields`,
  });

// Schema for update subscription
const updateUserSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid('starter', 'pro', 'business')
    .required()
    .messages({
      'string.base': `{{#label}} should be a type of string`,
      'string.empty': `{{#label}} must contain value`,
      'any.required': `missing field {{#label}}`,
    }),
})
  .required()
  .messages({
    'any.required': `missing field {{#label}}`,
  });

// Schema for resent verify email
const verifyUserEmailSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.base': `{{#label}} should be a type of string`,
    'string.empty': `{{#label}} must contain value`,
    'string.email':
      '{{#label}} must be contain symbol @ and look like "jekie@gmail.com"',
    'any.required': `{{#label}} is a required field`,
  }),
})
  .required()
  .messages({
    'any.required': `missing fields`,
  });

module.exports = {
  registerUserSchema,
  loginUserSchema,
  updateUserSubscriptionSchema,
  verifyUserEmailSchema,
};
