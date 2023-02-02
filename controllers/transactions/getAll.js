const { Transaction } = require('../../models');

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const transactionsCount = await Transaction.find({ owner }).count();

  const allTransactions = await Transaction.find(
    { owner },
    '-createdAt -updatedAt',
    {
      skip,
      limit,
    }
  )
    .sort({ date: -1 })
    .populate('owner', 'firstName email totalBalance');

  res.json({
    status: 'success',
    code: 200,
    data: {
      transactions: allTransactions,
      transactionsCount,
    },
  });
};

module.exports = getAll;
