const { Transaction } = require('../models');

const checkTransactionDate = async (req, res, next) => {
  const { _id: owner, categories } = req.user;

  const { amount, date, transactionType } = req.body;

  const transactionsByDate = await Transaction.find({
    owner,
    date: { $gt: date },
  });

  if (transactionsByDate.length > 0) {
    const inAscendingDate = transactionsByDate.sort(
      (firstDate, secondDate) => firstDate.date - secondDate.date
    );

    const newInitBalance = inAscendingDate[0].transactionType
      ? inAscendingDate[0].remainingBalance - inAscendingDate[0].amount
      : inAscendingDate[0].remainingBalance + inAscendingDate[0].amount;

    const updateReqUser = inAscendingDate.map(async it => {
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
