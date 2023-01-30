const jwt = require('jsonwebtoken');

const getCurrentUser = (req, res) => {
  const { SECRET_KEY } = process.env;
  const token = req.body;
  const { _id, email, subscription, firstName } = req.user;

  const user = jwt.sign(token, SECRET_KEY, { expiresIn: '23h' });

  console.log('user', user);

  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      user: {
        _id,
        firstName,
        email,
        subscription,
      },
    },
  });
};

module.exports = getCurrentUser;
