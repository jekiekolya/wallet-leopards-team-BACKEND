const express = require('express');
const router = express.Router();

const { validation, ctrlWrapper, auth } = require('../../middlewares');
const { categorySchema } = require('../../schemas');
const { categories: ctrl } = require('../../controllers');

router.post(
  '/',
  auth,
  validation(categorySchema.addCategorySchema),
  ctrlWrapper(ctrl.add)
);

router.delete('/:categoryId', auth, ctrlWrapper(ctrl.remove));

module.exports = router;
