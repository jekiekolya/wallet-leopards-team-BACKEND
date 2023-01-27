const express = require('express');
const router = express.Router();

const { transaction: ctrl } = require('../../controllers');
const { transactionSchema } = require('../../schemas');
const { validation, auth, ctrlWrapper } = require('../../middlewares');

router.post(
  '/',
  auth,
  validation(transactionSchema.addSchema),
  ctrlWrapper(ctrl.addTransaction)
);

router.get('/', auth, ctrlWrapper(ctrl.getAll));

module.exports = router;
