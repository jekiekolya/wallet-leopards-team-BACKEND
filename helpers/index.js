const handleMongooseError = require('./handleMongooseError');
const uploadFileToCloudinary = require('./uploadFileToCloudinary');
const sendEmail = require('./sendEmail');
const createEmailMarkup = require('./createEmailMarkup');
const resetPasswordMarkup = require('./resetPasswordMarkup');
const formatNumber = require('./formatNumber');

module.exports = {
  handleMongooseError,
  uploadFileToCloudinary,
  sendEmail,
  createEmailMarkup,
  resetPasswordMarkup,
  formatNumber,
};
