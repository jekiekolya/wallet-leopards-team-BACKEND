const { User } = require('../../models');
const { Unauthorized } = require('http-errors');
const jwt = require('jsonwebtoken');

const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { SECRET_KEY } = process.env;

  const oldUser = await User.findOne({ _id: id });

  if (!oldUser) {
    throw new Unauthorized(`Use not exists!`);
  }

  const secret = SECRET_KEY + oldUser.password;

  try {
    const verify = jwt.verify(token, secret);
    res.render('newPasswordForm', {
      email: verify.email,
      status: 'Not Verified',
    });
  } catch (error) {
    res.send('Not verified');
  }
};

module.exports = resetPassword;
