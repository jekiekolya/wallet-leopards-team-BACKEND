const Joi = require('joi');

const isOnlyLetters = /^[a-zA-Zа-яА-Я ]*$/;

const addSchema = Joi.object({
  transactionType: Joi.boolean().required(),
  amount: Joi.number().required(),
  date: Joi.date().iso().required(),
  comment: Joi.string().regex(isOnlyLetters).optional().min(0).max(200),
  category: Joi.string(),
});

module.exports = {
  addSchema,
};
