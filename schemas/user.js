const Joi = require('joi');

const emailPattern = /^\w+[\w-.]*\w@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/

// NOTE: There may be an additional field like NAME_USER
const registerUserSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(12).required().messages({
    'string.base': `{{#label}} should be a type of string`,
    'string.empty': `{{#label}} must contain value`,
    'string.min': `{{#label}} should have a minimum length of 1`,
    'string.max': `{{#label}} should have a maximum length of 12`,
    'any.required': `{{#label}} is a required field`,
  }),
  email: Joi.string().trim().pattern(emailPattern).email().required().messages({
    'string.base': `{{#label}} should be a type of string`,
    'string.empty': `{{#label}} must contain value`,
    'string.pattern': `{{#label}} must be a valid email. For example: example123@example.com`,
    'string.email':
      '{{#label}} must be contain symbol @ and look like "jekie@gmail.com"',
    'any.required': `{{#label}} is a required field`,
  }),
  password: Joi.string().trim().min(6).max(12).required().messages({
    'string.base': `{{#label}} should be a type of string`,
    'string.empty': `{{#label}} must contain value`,
    'string.min': `{{#label}} should have a minimum length of 6`,
    'string.max': `{{#label}} should have a maximum length of 12`,
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
  password: Joi.string().trim().min(6).max(12).required().messages({
    'string.base': `{{#label}} should be a type of string`,
    'string.empty': `{{#label}} must contain value`,
    'string.min': `{{#label}} should have a minimum length of 6`,
    'string.max': `{{#label}} should have a maximum length of 12`,
    'any.required': `{{#label}} is a required field`,
  }),
})
  .required()
  .messages({
    'any.required': `missing fields`,
  });

const passwordUserSchema = Joi.object({
  password: Joi.string().trim().min(6).max(12).required().messages({
    'string.base': `{{#label}} should be a type of string`,
    'string.empty': `{{#label}} must contain value`,
    'string.min': `{{#label}} should have a minimum length of 6`,
    'string.max': `{{#label}} should have a maximum length of 12`,
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

// Schema for update user name
const updateUserNameSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(12).required().messages({
    'string.base': `{{#label}} should be a type of string`,
    'string.empty': `{{#label}} must contain value`,
    'string.min': `{{#label}} should have a minimum length of 1`,
    'string.max': `{{#label}} should have a maximum length of 12`,
    'any.required': `{{#label}} is a required field`,
  }),
})
  .required()
  .messages({
    'any.required': `missing field {{#label}}`,
  });

module.exports = {
  registerUserSchema,
  loginUserSchema,
  updateUserSubscriptionSchema,
  verifyUserEmailSchema,
  updateUserNameSchema,
  passwordUserSchema,
};
