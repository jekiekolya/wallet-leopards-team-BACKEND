const register = require('./register');
const login = require('./login');
const logout = require('./logout');
const verifyEmail = require('./verifyEmail');

const passwordRecovery = require('./passwordRecovery');

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  passwordRecovery,
};
