const register = require('./register');
const login = require('./login');
const logout = require('./logout');
const verifyEmail = require('./verifyEmail');
const forgotPassword = require('./forgotPassword');
const resetPassword = require('./resetPassword');
const googleAuth = require('./googleAuth');

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  googleAuth,
};
