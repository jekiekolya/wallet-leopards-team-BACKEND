const { Unauthorized } = require('http-errors');
const jwt = require('jsonwebtoken');

const { User } = require('../../models');

const loginUser = async (req, res) => {
  const { SECRET_KEY } = process.env;
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // Checking if user appearing
  if (!user || !user.comparePassword(password)) {
    throw new Unauthorized('Email or password is wrong');
  }

  if (!user.verify) {
    throw new Unauthorized('Email is not verified');
  }

  // Creating token
  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

  // Add token to current user
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
      token,
    },
  });
};

module.exports = loginUser;
