const Joi = require('joi');

const isOnlyLetters = /(^[а-яА-ЯёЁa-zA-ZЇїІіЄєҐґ ]+$)/u;
const isEmpty = /[\S\s]+[\S]+/;

const addSchema = Joi.object({
  transactionType: Joi.boolean().required().messages({
    'boolean.base': `{{#label}} should be a type of boolean`,
    'any.required': `{{#label}} is a required field`,
  }),
  amount: Joi.number().min(0).required().messages({
    'number.base': `{{#label}} should be a type of number`,
    'number.min': `{{#label}} cannot be negative and must be greater than 0`,
    'any.required': `{{#label}} is a required field`,
  }),
  date: Joi.date().iso().required().messages({
    'date.base': `{{#label}} should be a type of date`,
    'any.required': `{{#label}} is a required field`,
  }),
  comment: Joi.string()
    .pattern(isOnlyLetters)
    .regex(isEmpty)
    .optional()
    .min(0)
    .max(200)
    .messages({
      'string.base': `{{#label}} should be a type of string`,
      'string.empty': `{{#label}} must contain value`,
      'string.pattern.base': `{{#label}} accepts only letters and cannot be an empty string`,
      'string.min': `{{#label}} should have a minimum length of 0`,
      'string.max': `{{#label}} should have a maximum length of 200`,
      'any.required': `{{#label}} is a required field`,
    }),
  category: Joi.string().messages({
    'string.base': `{{#label}} should be a type of string`,
  }),
});

module.exports = {
  addSchema,
};
