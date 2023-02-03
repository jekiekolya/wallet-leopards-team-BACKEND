const { Transaction, User } = require('../../models');
const { BadRequest } = require('http-errors');

const { formatNumber, formatDate } = require('../../helpers');

const addTransaction = async (req, res) => {
  const {
    _id: owner,
    totalBalance: userBalance,
    categories,
    currentInitBalance,
    changeBalance,
  } = req.user;

  const { transactionType, category, amount, date } = req.body;

  const dateNow = new Date();

  const currentDate = formatDate(dateNow);
  const transactionDate = formatDate(new Date(date));

  if (transactionDate.getTime() > currentDate.getTime()) {
    throw new BadRequest('Cannot select future date');
  }

  if (!transactionType && !category) {
    throw new BadRequest('Please choose the costs category');
  }

  if (transactionType && category) {
    throw new BadRequest('Invalid request body');
  }

  const symbolsLength = amount.toString().match(/\.(\d+)/)?.[1].length;

  if (symbolsLength > 2) {
    throw new BadRequest('Maximum of 2 decimal places');
  }

  let calculatedBalance = 0;

  if (!transactionType && !changeBalance) {
    calculatedBalance = userBalance - amount;
  }

  if (transactionType && !changeBalance) {
    calculatedBalance = userBalance + amount;
  }

  if (!transactionType && changeBalance) {
    calculatedBalance = currentInitBalance - amount;
  }

  if (transactionType && changeBalance) {
    calculatedBalance = currentInitBalance + amount;
  }

  const remainingBalance = formatNumber(Number(calculatedBalance));

  let totalBalance = null;
  if (!changeBalance) {
    totalBalance = formatNumber(remainingBalance);
    await User.findByIdAndUpdate(owner, { totalBalance });
  } else {
    totalBalance = formatNumber(userBalance);
    await User.findByIdAndUpdate(owner, { totalBalance });
  }

  const formatAmount = formatNumber(amount);

  if (!category) {
    const result = await Transaction.create({
      ...req.body,
      amount: formatAmount,
      remainingBalance,
      owner,
    });

    return res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        transaction: result,
        totalBalance,
      },
    });
  } else {
    const isCategory = categories.find(it => it._id === category);

    if (!isCategory) {
      throw new BadRequest('Incorrectly selected category');
    }

    const result = await Transaction.create({
      ...req.body,
      amount: formatAmount,
      category: isCategory,
      remainingBalance,
      owner,
    });

    return res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        transaction: result,
        totalBalance,
      },
    });
  }
};

module.exports = addTransaction;
