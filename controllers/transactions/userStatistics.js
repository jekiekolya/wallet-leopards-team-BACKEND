const { Transaction } = require('../../models');
const { User } = require('../../models');
const { BadRequest } = require('http-errors');

const userStatistics = async (req, res) => {
  const { _id: owner, firstName } = req.user;
  const { totalBalance } = await User.findByIdAndUpdate(owner);

  const yearsNow = new Date().getFullYear();
  const monthNow = new Date().getMonth();

  const { year = `${yearsNow}`, month = `${monthNow + 1}` } = req.query;

  if (month < 1 || month > 12) {
    throw new BadRequest('Invalid Date');
  }

  const allTransaction = await Transaction.find(
    { owner },
    ' -updatedAt',
    {}
  ).populate('owner', 'firstName email totalBalance');

  const startDate = new Date(`${year}-${month}-02`);
  const endDate = new Date(year, month, 1);

  const getAllExpensesTransaction = allTransaction.filter(
    item => item.transactionType === false
  );

  const getAllIncomeTransaction = allTransaction.filter(
    item => item.transactionType === true
  );

  const getExpensesTransactionPerMonth = allTransaction.filter(
    item => item.date >= startDate && item.date <= endDate
  );

  const getAllIncomeTransactionPerMonth = getExpensesTransactionPerMonth.filter(
    item => item.transactionType === true
  );

  const getAllExpensesTransactionPerMonth =
    getExpensesTransactionPerMonth.filter(
      item => item.transactionType === false
    );

  const getTotalAmount = data =>
    data.reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalIncome = getTotalAmount(getAllIncomeTransaction);
  const totalExpenses = getTotalAmount(getAllExpensesTransaction);
  const incomePerMonth = getTotalAmount(getAllIncomeTransactionPerMonth);
  const expensesPerMonth = getTotalAmount(getAllExpensesTransactionPerMonth);
  const balancePerMont = incomePerMonth - expensesPerMonth;

  const amountByTransaction = transaction =>
    transaction.reduce((acc, transaction) => {
      const id = transaction.category._id;
      const sameTransaction = acc.find(element => element.category._id === id);

      if (sameTransaction !== undefined)
        sameTransaction.amount += transaction.amount;
      else acc.push(transaction);

      return acc;
    }, []);

  const createCategoryObject = transaction =>
    transaction.map(item => {
      const id = item.category._id;
      const name = item.category.name;
      const amount = item.amount;
      const object = { id, name, amount };
      return object;
    });

  const expensesByPeriod = createCategoryObject(
    amountByTransaction(getAllExpensesTransactionPerMonth)
  );

  const allExpensesByCategory = createCategoryObject(
    amountByTransaction(getAllExpensesTransaction)
  );

  const data = {
    firstName,
    id: owner,
    incomePerMonth,
    expensesPerMonth,
    balancePerMont,
    totalIncome,
    totalExpenses,
    totalBalance,
    searchPeriod: { month, year },
    expensesByPeriod,
    allExpensesByCategory,
  };

  res.status(200).json({
    status: 'success',
    code: 200,
    data,
  });
};

module.exports = userStatistics;
