const { Transaction } = require('../../models');

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const allTransactions = await Transaction.find(
    { owner },
    '-createdAt -updatedAt',
    {
      skip,
      limit,
    }
  ).populate('owner', 'firstName email totalBalance');

  const result = [...allTransactions].reverse().sort(function (a, b) {
    return Number(Date.parse(b.date)) - Number(Date.parse(a.date));
  });

  res.json({
    status: 'success',
    code: 200,
    data: {
      transactions: result,
    },
  });
};

module.exports = getAll;
