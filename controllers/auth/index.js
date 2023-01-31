const register = require('./register');
const login = require('./login');
const logout = require('./logout');
const verifyEmail = require('./verifyEmail');
const forgotPassword = require('./forgotPassword');
const resetPassword = require('./resetPassword');

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
