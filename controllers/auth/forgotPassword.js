const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const { sendEmail, resetPasswordMarkup } = require('../../helpers');
const { NotFound, Unauthorized } = require('http-errors');

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const { SECRET_KEY, FRONT_URL } = process.env;

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFound(`User with email: ${email}, not found!`);
  }

  // if (!user.verify) {
  //   throw new Unauthorized(`Email: ${email} not verified!`);
  // }

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

  // await sendEmail(mail);
  console.log('mail', mail);
  res.status(201).json({
    status: 'success',
    code: 201,
    message: `Done! We send password reset link to ${email}`,
  });
};

module.exports = forgotPassword;
