const express = require('express');
const router = express.Router();

const ctrl = require('../../controllers/transactions');
const { schemas } = require('../../models');
const { validation, auth, ctrlWrapper } = require('../../middlewares');

router.post(
  '/',
  auth,
  validation(schemas.addSchema),
  ctrlWrapper(ctrl.addTransaction)
);

router.get('/', auth, ctrlWrapper(ctrl.getAll));

module.exports = router;
