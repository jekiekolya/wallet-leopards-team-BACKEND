const { Transaction, User } = require('../../models');
const { BadRequest } = require('http-errors');

const addTransaction = async (req, res) => {
  const { _id: owner, totalBalance, categories } = req.user;

  const { transactionType, category, amount } = req.body;

  if (!transactionType && !category) {
    throw new BadRequest('Please choose the costs category');
  }

  const isCategory = categories.find(it => it._id === category.id);

  if (!isCategory) {
    throw new BadRequest('Incorrectly selected category');
  }

  let remainingBalance = 0;

  if (!transactionType) {
    remainingBalance = totalBalance - amount;
  } else {
    remainingBalance = totalBalance + amount;
  }

  await User.findByIdAndUpdate(owner, { totalBalance: remainingBalance });

  const result = await Transaction.create({
    ...req.body,
    remainingBalance,
    owner,
  });

  res.status(201).json({
    status: 'success',
    code: 201,
    data: {
      transaction: result,
    },
  });
};

module.exports = addTransaction;
