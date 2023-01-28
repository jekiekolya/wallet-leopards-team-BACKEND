const Joi = require('joi');

const addCategorySchema = Joi.object({
  category: Joi.string().required(),
});

const removeCategorySchema = Joi.object({
  category: Joi.string().required(),
});

module.exports = {
  addCategorySchema,
  removeCategorySchema,
};
