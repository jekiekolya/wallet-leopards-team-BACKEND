const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const { sendEmail, resetPasswordMarkup } = require('../../helpers');

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const { SECRET_KEY, FRONT_URL } = process.env;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({
      status: 'error',
      code: 404,
      message: `User with email: ${email}, not found!`,
    });
    return;
  }

  const secret = SECRET_KEY + user.password;
  const token = jwt.sign({ email: user.email, id: user._id }, secret, {
    expiresIn: '5m',
  });

  const link = `${FRONT_URL}/create-password?id=${user._id}&token=${token}`;

  const mail = {
    to: email,
    subject: 'PASSWORD RECOVERY',
    html: resetPasswordMarkup(link),
  };
  console.log('link', link);
  // await sendEmail(mail);

  res.status(201).json({
    status: 'success',
    code: 201,
    message: `Done! We send password reset link to ${email}`,
  });
};

module.exports = forgotPassword;
