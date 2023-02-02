const jwt = require('jsonwebtoken');

const { User } = require('../../models');

const { SECRET_KEY } = process.env;

const BASE_FRONTEND_URL =
  'https://jekiekolya.github.io/wallet-leopards-team-FRONTEND';

const googleAuth = async (req, res) => {
  const { _id: id } = req.user;
  const payload = { id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });

  await User.findByIdAndUpdate(id, { token, verificationToken: null });

  res.redirect(`${BASE_FRONTEND_URL}?token=${token}`);
};

module.exports = googleAuth;
