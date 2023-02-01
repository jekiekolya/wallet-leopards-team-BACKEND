const jwt = require('jsonwebtoken');

const { User } = require('../../models');

const { SECRET_KEY } = process.env;

// const BASE_FRONTEND_URL =
//   'https://jekiekolya.github.io/wallet-leopards-team-FRONTEND';

const googleAuth = async (req, res) => {
  //   const { _id: id } = req.user;
  //   const payload = { id };
  //   const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
  //   await User.findByIdAndUpdate(id, { token, verificationToken: null });
  //   res.redirect(`${BASE_FRONTEND_URL}?token=${token}`);
  const userId = req.session.passport.user._id;

  const user = await User.findById(userId);

  const payload = { userId };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });

  await User.findByIdAndUpdate(userId, { token, verificationToken: null });

  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
        firstName: user.firstName,
        categories: user.categories,
      },
      token,
    },
  });
};

module.exports = googleAuth;
