const { Conflict } = require('http-errors');
const gravatar = require('gravatar');
const uniqid = require('uniqid');

require('dotenv').config();
const { BASE_URL } = process.env;

const { User } = require('../../models');
const { sendEmail } = require('../../helpers');

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // Checking if user already exist
  if (user) {
    throw new Conflict(`User with email - ${email}, already exist`);
  }

  // Get avatar URL
  const avatarURL = gravatar.url(email);

  // Create verificationToken user
  const verificationToken = uniqid();

  // Creating new user with hashed password
  const newUser = new User({ email, avatarURL, verificationToken });
  newUser.setPassword(password);

  const createdUser = await newUser.save();

  // Send email for verification
  const mail = {
    to: email,
    subject: 'Verification email',
    text: `Please, confirm your email: ${BASE_URL}/api/users/verify/${verificationToken}`,
    html: `<p>Please, <a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">confirm</a> your email</p>`,
  };
  await sendEmail(mail);

  res.status(201).json({
    status: 'success',
    code: 201,
    data: {
      user: {
        email,
        avatarURL,
        subscription: createdUser.subscription,
        verificationToken,
      },
    },
  });
};

module.exports = register;
