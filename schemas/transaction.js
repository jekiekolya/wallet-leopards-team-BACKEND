const Joi = require('joi');

const addSchema = Joi.object({
  transactionType: Joi.boolean().required(),
  amount: Joi.number().required(),
  date: Joi.date().iso().required(),
  comment: Joi.string().optional().min(0).max(200),
  category: Joi.object(),
});

module.exports = {
  addSchema,
};
