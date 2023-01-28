const { Transaction, User } = require('../../models');
const { BadRequest } = require('http-errors');

const addTransaction = async (req, res) => {
  const {
    _id: owner,
    totalBalance: userBalance,
    categories,
    currentInitBalance,
    changeBalance,
  } = req.user;

  const { transactionType, category, amount } = req.body;

  if (!transactionType && !category) {
    throw new BadRequest('Please choose the costs category');
  }

  if (transactionType && category) {
    throw new BadRequest('Invalid request body');
  }

  let remainingBalance = 0;

  if (!transactionType && !changeBalance) {
    remainingBalance = userBalance - amount;
  }

  if (transactionType && !changeBalance) {
    remainingBalance = userBalance + amount;
  }

  if (!transactionType && changeBalance) {
    remainingBalance = currentInitBalance - amount;
  }

  if (transactionType && changeBalance) {
    remainingBalance = currentInitBalance + amount;
  }

  if (!changeBalance) {
    await User.findByIdAndUpdate(owner, { totalBalance: remainingBalance });
  } else {
    await User.findByIdAndUpdate(owner, { totalBalance: userBalance });
  }

  if (!category) {
    const result = await Transaction.create({
      ...req.body,
      remainingBalance,
      owner,
    });

    return res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        transaction: result,
      },
    });
  } else {
    const isCategory = categories.find(it => it._id === category);

    if (!isCategory) {
      throw new BadRequest('Incorrectly selected category');
    }

    const result = await Transaction.create({
      ...req.body,
      category: isCategory,
      remainingBalance,
      owner,
    });

    return res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        transaction: result,
      },
    });
  }
};

module.exports = addTransaction;
