const { Transaction } = require('../../models');

const userStatistics = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Transaction.find({ owner }, ' -updatedAt', {}).populate(
    'owner',
    'firstName email totalBalance'
  );

  res.status(200).json({
    status: 'success',
    code: 200,

    data: {
      result,
    },
  });
};

module.exports = userStatistics;
