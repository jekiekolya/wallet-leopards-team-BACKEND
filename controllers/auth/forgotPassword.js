const { Unauthorized } = require('http-errors');
// const { sendEmail } = require('../../helpers');
const { resetPasswordMarkup } = require('../../helpers');
const { User } = require('../../models');
const jwt = require('jsonwebtoken');

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  const { SECRET_KEY } = process.env;

  if (!user) {
    res.status(401).json({
      status: 'error',
      code: 401,
      message: `User with email: ${email}, not found!`,
    });
  }

  const secret = SECRET_KEY + user.password;
  const token = jwt.sign({ email: user.email, id: user._id }, secret, {
    expiresIn: '5m',
  });

  const link = `http://localhost:3001/wallet-leopards-team-FRONTEND/create-password?id=${user._id}&token=${token}`;

  console.log('link', link);

  const mail = {
    to: email,
    subject: 'PASSWORD RECOVERY',
    html: resetPasswordMarkup(link),
  };

  // await sendEmail(mail);

  res.status(201).json({
    status: 'success',
    code: 201,
    message: `Done! We send password reset link to ${email}`,
    data: {
      id: user._id,
      token,
    },
  });
};

module.exports = forgotPassword;
