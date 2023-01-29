const { sendEmail } = require('../../helpers');
const { resetPasswordMarkup } = require('../../helpers');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const resetPassword = async (req, res) => {
  const { email } = req.body;
  // const { SECRET_KEY } = process.env;

  const mail = {
    to: email,
    subject: 'PASSWORD RECOVERY',
    html: resetPasswordMarkup(email),
  };
  await sendEmail(mail);

  res.status(201).json({
    status: 'success',
    code: 201,
    data: {
      email,
    },
  });
};

module.exports = resetPassword;
