const { Unauthorized } = require('http-errors');
const { sendEmail } = require('../../helpers');
const { resetPasswordMarkup } = require('../../helpers');
const { User } = require('../../models');
const jwt = require('jsonwebtoken');

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const oldUser = await User.findOne({ email });
  const { SECRET_KEY, BASE_URL } = process.env;

  if (!oldUser) {
    throw new Unauthorized(`User with email: ${email}, Not Found!`);
  }

  const secret = SECRET_KEY + oldUser.password;
  const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
    expiresIn: '55m',
  });

  const link = `${BASE_URL}/api/auth/reset-password/${oldUser._id}/${token}`;

  console.log('link', link);

  const mail = {
    to: email,
    subject: 'PASSWORD RECOVERY',
    html: resetPasswordMarkup(link),
  };

  // await sendEmail(mail);

  res.status(200).json({
    status: 'success',
    code: 200,
    message: `Done! We send password reset link to ${email}`,
    data: {
      email,
      link,
    },
  });
};

module.exports = forgotPassword;
