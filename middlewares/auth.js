const { Unauthorized } = require('http-errors');
const jwt = require('jsonwebtoken');

const { User } = require('../models');

const auth = async (req, res, next) => {
  const { SECRET_KEY } = process.env;
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  try {
    if (bearer !== 'Bearer') {
      throw new Unauthorized('Not authorized');
    }

    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token) {
      throw new Unauthorized('Not authorized');
    }

    // Add to request object with user
    req.user = user;
    next();
  } catch (error) {
    if (error.message === 'invalid token') {
      error.status = 401;
    }
    next(error);
  }
};

module.exports = auth;
