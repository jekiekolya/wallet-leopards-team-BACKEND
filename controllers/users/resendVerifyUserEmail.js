const jwt = require('jsonwebtoken');
const { NotFound, Conflict } = require('http-errors');
const { createEmailMarkup } = require('../../helpers');

require('dotenv').config();
const { SECRET_KEY } = process.env;

const { User } = require('../../models');
const { sendEmail } = require('../../helpers');

const resendVerifyUserEmail = async (req, res) => {
  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  // Checking if user appear
  if (!user) {
    throw new NotFound(`User with ${email} not found`);
  }

  // Checking if user already exist
  if (user.verify) {
    throw new Conflict(`User with email - ${email}, already verified`);
  }

  // Create verificationToken user
  const payload = { id: user._id };
  const verificationToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });

  // Send email for verification
  const mail = {
    to: email,
    subject: 'Verification email',
    text: `Please, confirm your email: https://jekiekolya.github.io/wallet-leopards-team-FRONTEND/signUp/verify/${verificationToken}`,
    html: createEmailMarkup(verificationToken),
  };
  await sendEmail(mail);

  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      user: {
        email,
      },
      message: `A verification letter was sent to the email - ${email}`,
      verificationToken,
    },
  });
};

module.exports = resendVerifyUserEmail;
