const express = require('express');
const router = express.Router();

const { validation, ctrlWrapper, auth } = require('../../middlewares');
const { userSchema } = require('../../schemas');
const { auth: ctrl } = require('../../controllers');

router.post(
  '/register',
  validation(userSchema.registerUserSchema),
  ctrlWrapper(ctrl.register)
);

router.post(
  '/login',
  validation(userSchema.loginUserSchema),
  ctrlWrapper(ctrl.login)
);

router.post('/logout', auth, ctrlWrapper(ctrl.logout));

// Verification user
router.get('/verify/:verificationToken', ctrlWrapper(ctrl.verifyEmail));

// Reset password
router.post('/forgot-password', ctrlWrapper(ctrl.forgotPassword));

router.get('/reset-password/:id/:token', ctrlWrapper(ctrl.resetPassword));

router.post('/reset-password/:id/:token', ctrlWrapper(ctrl.submitPassword));

module.exports = router;
