const { User } = require('../../models');
const { Unauthorized } = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const { SECRET_KEY } = process.env;

  const user = await User.findOne({ _id: id });

  if (!user) {
    throw new Unauthorized(`User not exists!`);
  }

  const secret = SECRET_KEY + user.password;

  try {
    jwt.verify(token, secret);
  } catch (error) {
    res.status(498).json({ message: `Token not valid`, error });
    return;
  }

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

  res.status(201).json({
    status: 'success',
    code: 201,
    message: `New password created!`,
  });
};

module.exports = resetPassword;
