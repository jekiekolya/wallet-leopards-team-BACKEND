const { User } = require('../../models');
const { Unauthorized } = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const submitPassword = async (req, res) => {
  const { id, token } = req.params;
  const { SECRET_KEY } = process.env;
  const { password } = req.body;
  console.log('password', password);

  const oldUser = await User.findOne({ _id: id });

  if (!oldUser) {
    throw new Unauthorized(`Use not exists!`);
  }

  const secret = SECRET_KEY + oldUser.password;

  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render('redirectToLogin', { email: verify.email, status: 'verified' });
  } catch (error) {
    res.status(404).json('Something went wrong, try again...');
  }
};

module.exports = submitPassword;
