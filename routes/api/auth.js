const express = require('express');
const router = express.Router();

const {
  validation,
  ctrlWrapper,
  auth,
  passport,
} = require('../../middlewares');
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
router.post(
  '/forgot-password',
  validation(userSchema.verifyUserEmailSchema),
  ctrlWrapper(ctrl.forgotPassword)
);

router.post(
  '/reset-password/:id/:token',
  validation(userSchema.passwordUserSchema),
  ctrlWrapper(ctrl.resetPassword)
);

// Google authorization

// Google authorization request that should come from the frontend
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);

// Google callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
  }),
  ctrlWrapper(ctrl.googleAuth)
);

module.exports = router;
