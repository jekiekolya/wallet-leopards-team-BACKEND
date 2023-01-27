const getCurrentUser = require('./getCurrentUser');
const updateSubscription = require('./updateSubscription');
const updateAvatar = require('./updateAvatar');
const resendVerifyUserEmail = require('./resendVerifyUserEmail');
const userStatistics = require('./userStatistics');

module.exports = {
  getCurrentUser,
  updateSubscription,
  updateAvatar,
  resendVerifyUserEmail,
  userStatistics,
};
