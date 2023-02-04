const { isValidObjectId } = require('mongoose');

const isValidId = (req, _, next) => {
  const { transactionId } = req.params;
  if (!isValidObjectId(transactionId)) {
    const error = new Error(`${transactionId} is not correct`);
    error.status = 400;
    next(error);
  }
  next();
};

module.exports = isValidId;
