const express = require('express');
const router = express.Router();

const { validation, ctrlWrapper, auth } = require('../../middlewares');
const { categorySchema } = require('../../schemas');
const { categories: ctrl } = require('../../controllers');

router.post(
  '/add',
  auth,
  validation(categorySchema.addCategorySchema),
  ctrlWrapper(ctrl.add)
);

router.delete(
  '/remove',
  auth,
  validation(categorySchema.removeCategorySchema),
  ctrlWrapper(ctrl.remove)
);

module.exports = router;
