const express = require('express');
const router = express.Router();

const { transaction: ctrl } = require('../../controllers');
const { transactionSchema } = require('../../schemas');
const {
  validation,
  auth,
  ctrlWrapper,
  checkTransactionDate,
  isValidId,
} = require('../../middlewares');

router.post(
  '/',
  auth,
  validation(transactionSchema.addSchema),
  checkTransactionDate,
  ctrlWrapper(ctrl.addTransaction)
);

router.get('/', auth, ctrlWrapper(ctrl.getAll));

router.get('/statistics', auth, ctrlWrapper(ctrl.userStatistics));

router.delete(
  '/:transactionId',
  isValidId,
  auth,
  ctrlWrapper(ctrl.deleteTransaction)
);
module.exports = router;
