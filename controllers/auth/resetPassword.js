const { sendEmail } = require('../../helpers');
const { resetPasswordMarkup } = require('../../helpers');

const resetPassword = async (req, res) => {
  const { email, OTP } = req.body;

  const mail = {
    to: email,
    subject: 'PASSWORD RECOVERY',
    html: resetPasswordMarkup(OTP),
  };
  await sendEmail(mail);

  res.status(201).json({
    status: 'success',
    code: 201,
    data: {
      email,
      OTP,
    },
  });
};

module.exports = resetPassword;
