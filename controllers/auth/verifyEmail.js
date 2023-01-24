const { NotFound } = require('http-errors');

const { User } = require('../../models');

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw new NotFound('User not found');
  }

  // confirm verify
  await User.findOneAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      message: 'Verification successful',
    },
  });
};

module.exports = verifyEmail;
