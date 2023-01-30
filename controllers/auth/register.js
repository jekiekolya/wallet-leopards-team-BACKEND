const { Conflict } = require('http-errors');
const uniqid = require('uniqid');

const { categoriesList } = require('../../src');
const { createEmailMarkup } = require('../../helpers');
require('dotenv').config();

const { User } = require('../../models');
const { sendEmail } = require('../../helpers');

const register = async (req, res) => {
  const { firstName, email, password } = req.body;
  const user = await User.findOne({ email });

  // Checking if user already exist
  if (user) {
    throw new Conflict(`User with email - ${email}, already exist`);
  }

  // Get avatar URL
  const avatarURL =
    'https://res.cloudinary.com/dpvkleqce/image/upload/v1674652226/wallet_leopards/zn7ur1gmwynrbmnqgzkj.png';

  // Create verificationToken user
  const verificationToken = uniqid();

  // Create user categories list
  const categories = [...categoriesList];

  // Creating new user with hashed password
  const newUser = new User({
    firstName,
    email,
    avatarURL,
    categories,
    verificationToken,
  });
  newUser.setPassword(password);

  const createdUser = await newUser.save();

  // Send email for verification
  const mail = {
    to: email,
    subject: 'Verification email',
    text: `Please, confirm your email: https://jekiekolya.github.io/wallet-leopards-team-FRONTEND/signUp/verify/${verificationToken}`,
    html: createEmailMarkup(verificationToken),
  };
  await sendEmail(mail);

  res.status(201).json({
    status: 'success',
    code: 201,
    data: {
      user: {
        email,
        subscription: createdUser.subscription,
        verificationToken,
      },
    },
  });
};

module.exports = register;
