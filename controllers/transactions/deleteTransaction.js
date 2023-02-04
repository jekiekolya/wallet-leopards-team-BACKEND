const { NotFound } = require('http-errors');

const { Transaction, User } = require('../../models');
const { formatNumber } = require('../../helpers');

const deleteTransaction = async (req, res) => {
  const { transactionId } = req.params;
  console.log(req.params);
  const { _id: owner } = req.user;

  const trx = await Transaction.findByIdAndRemove(transactionId);
  console.log(trx);

  if (!trx) {
    throw new NotFound('Transaction not found');
  }

  const trxLater = await Transaction.find({
    owner,
    date: { $gt: trx.date },
  }).sort({ date: 1 });
  console.log(trxLater);

  if (trxLater.length > 0) {
    console.log(111);
    const recountRemainingBalance = trxLater.map(async it => {
      let newRemainingBalance = '';

      if (trx.transactionType) {
        const calculatedBalance = it.remainingBalance + trx.amount;
        newRemainingBalance = formatNumber(calculatedBalance);
      }
      if (!trx.transactionType) {
        const calculatedBalance = it.remainingBalance - trx.amount;
        newRemainingBalance = formatNumber(calculatedBalance);
      }

      await Transaction.findOneAndUpdate(
        { _id: it._id },
        {
          remainingBalance: newRemainingBalance,
        }
      );

      return newRemainingBalance;
    });

    const balanceData = await Promise.all(recountRemainingBalance);
    const recalculatedUserBalance = balanceData[balanceData.length - 1];

    await User.findByIdAndUpdate(
      { _id: owner },
      {
        totalBalance: recalculatedUserBalance,
      }
    );
  }

  return res.status(200).json({
    status: 'success',
    code: 200,
    message: 'Transaction deleted',
  });
};

module.exports = deleteTransaction;
