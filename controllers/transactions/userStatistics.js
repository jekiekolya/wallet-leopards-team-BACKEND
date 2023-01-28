const { Transaction } = require('../../models');
const { User } = require('../../models');

const userStatistics = async (req, res) => {
  const { _id: owner } = req.user;
  const { totalBalance: balance } = await User.findByIdAndUpdate(owner);
  const { year = 2023, month = 1 } = req.query;

  const allTransaction = await Transaction.find(
    { owner },
    ' -updatedAt',
    {}
  ).populate('owner', 'firstName email totalBalance');

  const startDate = new Date(`${year}-${month}-02`);
  const endDate = new Date(year, month, 1);

  const transactionFilterByDate = allTransaction.filter(
    item => item.date >= startDate && item.date <= endDate
  );

  const allExpensesTransaction = transactionFilterByDate.filter(
    item => item.transactionType === false
  );
  const allIncomeTransaction = transactionFilterByDate.filter(
    item => item.transactionType === true
  );

  const getTotalAmount = data =>
    data.reduce((acc, transaction) => acc + transaction.amount, 0);

  const amountByTransaction = allExpensesTransaction.reduce(
    (acc, transaction) => {
      const id = transaction.category._id;
      const sameTransaction = acc.find(element => element.category._id === id);

      if (sameTransaction !== undefined)
        sameTransaction.amount += transaction.amount;
      else acc.push(transaction);

      return acc;
    },
    []
  );

  const categoryExpenses = amountByTransaction.map(item => {
    const id = item.category._id;
    const name = item.category.name;
    const amount = item.amount;
    const object = { id, name, amount };
    return object;
  });

  const data = {
    expenses: getTotalAmount(allExpensesTransaction),
    income: getTotalAmount(allIncomeTransaction),
    balance,
    categoryExpenses,
  };

  res.status(200).json({
    status: 'success',
    code: 200,
    data,
  });
};

module.exports = userStatistics;
