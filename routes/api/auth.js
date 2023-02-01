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

const { BASE_URL } = process.env;

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

// Google callback processing
router.get('/login/success', ctrl.googleAuth);

router.get('/login/failure', ctrl.failGoogleAuth);

// (there were redirects to the frontend)
const successLink = `${BASE_URL}/api/auth/login/success`;
const failureLink = `${BASE_URL}/api/auth/login/failure`;

// Google callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: successLink,
    failureRedirect: failureLink,
  })
);

module.exports = router;
