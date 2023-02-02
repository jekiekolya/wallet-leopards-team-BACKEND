const jwt = require('jsonwebtoken');
const { NotFound, Conflict } = require('http-errors');
const { User } = require('../../models');

const { SECRET_KEY } = process.env;

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  // Verify token
  try {
    const { id } = jwt.verify(verificationToken, SECRET_KEY);

    const user = await User.findById(id);

    if (!user) {
      throw new NotFound('Not found user!');
    }

    if (user.verify) {
      throw new Conflict('User already verified!');
    }

    // confirm verify
    await User.findByIdAndUpdate(id, {
      verify: true,
    });

    res.status(200).json({
      status: 'success',
      code: 200,
      data: {
        message: 'Verification successful',
      },
    });
  } catch (error) {
    if (error.message !== 'invalid token') {
      throw error;
    }

    res.status(498).json({
      status: 'failure',
      code: 498,
      message: `invalid token`,
    });
  }
};

module.exports = verifyEmail;
