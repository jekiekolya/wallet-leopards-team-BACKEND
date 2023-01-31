const { Transaction } = require('../../models');
const { User } = require('../../models');
const { BadRequest } = require('http-errors');

const userStatistics = async (req, res) => {
  const { _id: owner, firstName } = req.user;
  const { totalBalance: balance } = await User.findByIdAndUpdate(owner);

  const yearsNow = new Date().getFullYear();
  const monthNow = new Date().getMonth();

  const { year = `${yearsNow}`, month = `${monthNow + 1}` } = req.query;

  if (month < 1 || month > 12) {
    throw new BadRequest('Date must be in ISO 8601 date format');
  }

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

  const expensesPerMonth = transactionFilterByDate.filter(
    item => item.transactionType === false
  );
  const getAllExpenses = allTransaction.filter(
    item => item.transactionType === false
  );
  const allIncomeTransaction = transactionFilterByDate.filter(
    item => item.transactionType === true
  );

  const getTotalAmount = data =>
    data.reduce((acc, transaction) => acc + transaction.amount, 0);

  const expenses = getTotalAmount(expensesPerMonth);
  const income = getTotalAmount(allIncomeTransaction);
  const profit = income - expenses;

  const amountByTransaction = transaction =>
    transaction.reduce((acc, transaction) => {
      const id = transaction.category._id;
      const sameTransaction = acc.find(element => element.category._id === id);

      if (sameTransaction !== undefined)
        sameTransaction.amount += transaction.amount;
      else acc.push(transaction);

      return acc;
    }, []);

  const expensesByCategory = transaction =>
    transaction.map(item => {
      const id = item.category._id;
      const name = item.category.name;
      const amount = item.amount;
      const object = { id, name, amount };
      return object;
    });

  const queryExpenses = expensesByCategory(
    amountByTransaction(expensesPerMonth)
  );

  const totalExpenses = expensesByCategory(amountByTransaction(getAllExpenses));

  const data = {
    firstName,
    _id: owner,
    income,
    expenses,
    profit,
    balance,
    queryDate: { month, year },
    queryExpenses,
    totalExpenses,
  };

  res.status(200).json({
    status: 'success',
    code: 200,
    data,
  });
};

module.exports = userStatistics;
