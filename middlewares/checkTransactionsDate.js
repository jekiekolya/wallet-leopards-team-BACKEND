const { Transaction } = require('../models');
const { formatDate } = require('../helpers');

const checkTransactionDate = async (req, res, next) => {
  const { _id: owner, categories } = req.user;

  const { amount, date, transactionType } = req.body;

  const trxDate = formatDate(new Date(date));

  const transactionsByDate = await Transaction.find({
    owner,
    date: { $gt: trxDate },
  }).sort({ date: 1 });

  if (transactionsByDate.length > 0) {
    const tx = transactionsByDate[0];
    const newInitBalance = tx.transactionType
      ? tx.remainingBalance - tx.amount
      : tx.remainingBalance + tx.amount;

    const updateReqUser = transactionsByDate.map(async it => {
      const expenseBalance = it.remainingBalance + it.amount;
      const incomeBalance = it.remainingBalance - it.amount;

      let newRemainingBalance = '';

      if (it.transactionType && !transactionType) {
        newRemainingBalance = incomeBalance - amount + it.amount;
      }

      if (it.transactionType && transactionType) {
        newRemainingBalance = incomeBalance + amount + it.amount;
      }

      if (!it.transactionType && !transactionType) {
        newRemainingBalance = expenseBalance - amount - it.amount;
      }

      if (!it.transactionType && transactionType) {
        newRemainingBalance = expenseBalance + amount - it.amount;
      }

      await Transaction.findOneAndUpdate(
        { _id: it._id },
        {
          remainingBalance: newRemainingBalance,
        }
      );

      const user = {};
      user._id = owner;
      user.categories = categories;
      user.changeBalance = true;
      user.totalBalance = newRemainingBalance;
      user.currentInitBalance = newInitBalance;

      return user;
    });

    const newReqUser = await Promise.all(updateReqUser);
    const result = newReqUser[newReqUser.length - 1];

    req.user = { ...result };

    return next();
  }
  next();
};

module.exports = checkTransactionDate;
