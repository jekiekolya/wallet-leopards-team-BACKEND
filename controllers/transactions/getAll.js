const { Transaction } = require('../../models');

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const result = await Transaction.find({ owner }, '-createdAt -updatedAt', {
    skip,
    limit,
  }).populate('owner', 'firstName email');

  res.json(result);
};

module.exports = getAll;
