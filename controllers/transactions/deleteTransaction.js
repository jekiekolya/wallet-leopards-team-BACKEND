const { NotFound } = require('http-errors');

const { Transaction, User } = require('../../models');
const { formatNumber, formatDate } = require('../../helpers');

const deleteTransaction = async (req, res) => {
  const { transactionId } = req.params;
  const { _id: owner, totalBalance } = req.user;

  const trx = await Transaction.findByIdAndRemove(transactionId);

  if (!trx) {
    throw new NotFound('Transaction not found');
  }
  const trxDate = formatDate(new Date(trx.date));

  const trxLater = await Transaction.find({
    owner,
    date: { $gt: trxDate },
  }).sort({ date: 1 });
  console.log(trxLater);

  if (trxLater.length > 0) {
    const recountRemainingBalance = trxLater.map(async it => {
      let newRemainingBalance = '';

      if (trx.transactionType && it.remainingBalance < 0) {
        const calculatedBalance = it.remainingBalance - trx.amount;
        newRemainingBalance = formatNumber(calculatedBalance);
      }

      if (trx.transactionType && it.remainingBalance > 0) {
        const calculatedBalance = it.remainingBalance - trx.amount;
        newRemainingBalance = formatNumber(calculatedBalance);
      }

      if (!trx.transactionType && it.remainingBalance < 0) {
        const calculatedBalance = it.remainingBalance + trx.amount;
        newRemainingBalance = formatNumber(calculatedBalance);
      }

      if (!trx.transactionType && it.remainingBalance > 0) {
        const calculatedBalance = it.remainingBalance + trx.amount;
        newRemainingBalance = formatNumber(calculatedBalance);
      }

      // if (trx.transactionType) {
      //   const calculatedBalance = it.remainingBalance + trx.amount;
      //   newRemainingBalance = formatNumber(calculatedBalance);
      // }
      // if (!trx.transactionType) {
      //   const calculatedBalance = it.remainingBalance - trx.amount;
      //   newRemainingBalance = formatNumber(calculatedBalance);
      // }

      console.log('rem', newRemainingBalance);

      await Transaction.findOneAndUpdate(
        { _id: it._id },
        {
          remainingBalance: newRemainingBalance,
        }
      );

      return newRemainingBalance;
    });

    const balanceData = await Promise.all(recountRemainingBalance);
    console.log('balance', balanceData);
    const recalculatedUserBalance = balanceData[balanceData.length - 1];

    await User.findByIdAndUpdate(
      { _id: owner },
      {
        totalBalance: recalculatedUserBalance,
      }
    );
  }

  if (trxLater.length === 0) {
    console.log(111);
    let newTotalBalance = '';

    console.log('tB', typeof totalBalance);

    if (trx.transactionType && totalBalance < 0) {
      const calculatedBalance = totalBalance - trx.amount;
      newTotalBalance = formatNumber(calculatedBalance);
    }
    if (trx.transactionType && totalBalance > 0) {
      const calculatedBalance = totalBalance - trx.amount;
      newTotalBalance = formatNumber(calculatedBalance);
    }

    if (!trx.transactionType && totalBalance < 0) {
      const calculatedBalance = totalBalance + trx.amount;
      newTotalBalance = formatNumber(calculatedBalance);
    }
    if (!trx.transactionType && totalBalance > 0) {
      const calculatedBalance = totalBalance + trx.amount;
      newTotalBalance = formatNumber(calculatedBalance);
    }

    console.log(newTotalBalance);
    console.log('nB', typeof newTotalBalance);

    await User.findByIdAndUpdate(
      { _id: owner },
      {
        totalBalance: newTotalBalance,
      }
    );
  }

  res.status(200).json({
    status: 'success',
    code: 200,
    message: 'Transaction deleted',
  });
};

module.exports = deleteTransaction;
