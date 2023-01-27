const { Transaction, User } = require('../../models');
const { BadRequest } = require('http-errors');

const addTransaction = async (req, res) => {
  const { _id: owner, totalBalance: userBalance, categories } = req.user;

  const { transactionType, category, amount } = req.body;

  console.log(category);

  if (!transactionType && !category) {
    throw new BadRequest('Please choose the costs category');
  }

  if (transactionType && category) {
    throw new BadRequest('Invalid request body');
  }

  let remainingBalance = 0;

  if (!transactionType) {
    remainingBalance = userBalance - amount;
  } else {
    remainingBalance = userBalance + amount;
  }

  await User.findByIdAndUpdate(owner, { totalBalance: remainingBalance });

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

  // const transactionsByDate = await Transaction.find({
  //   owner,
  //   date: { $lt: date },
  // });

  // const inAscendingDate = transactionsByDate.sort(
  //   (firstDate, secondDate) => firstDate.date - secondDate.date
  // );

  // const changeBalance = inAscendingDate.forEach(async it => {
  //   const newRemainingBalance = !it.transactionType
  //     ? it.initialBalance - amount
  //     : it.initialBalance + amount;
  //   await Transaction.findByIdAndUpdate(it._id, {
  //     remainingBalance: newRemainingBalance,
  //   });
  // });

  // console.log(changeBalance);
};

module.exports = addTransaction;
