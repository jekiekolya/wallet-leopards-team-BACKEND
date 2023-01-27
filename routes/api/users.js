const express = require('express');
const router = express.Router();

const { ctrlWrapper, auth, validation, upload } = require('../../middlewares');
const { users: ctrl } = require('../../controllers');
const { userSchema } = require('../../schemas');

router.get('/current', auth, ctrlWrapper(ctrl.getCurrentUser));

router.patch(
  '/subscription',
  auth,
  validation(userSchema.updateUserSubscriptionSchema),
  ctrlWrapper(ctrl.updateSubscription)
);

router.patch(
  '/avatars',
  auth,
  upload.single('avatar'),
  ctrlWrapper(ctrl.updateAvatar)
);

// Verify user email
router.post(
  '/verify',
  validation(userSchema.verifyUserEmailSchema),
  ctrlWrapper(ctrl.resendVerifyUserEmail)
);

module.exports = router;
