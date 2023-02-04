const { Transaction } = require('../../models');
const { User } = require('../../models');
const { BadRequest } = require('http-errors');
const formatNumber = require('../../helpers/formatNumber');

const userStatistics = async (req, res) => {
  const { _id: owner, firstName } = req.user;
  const { totalBalance } = await User.findById(owner);
  const yearsNow = new Date().getFullYear();
  const monthNow = new Date().getMonth();

  const { year = `${yearsNow}`, month = `${monthNow}` } = req.query;

  if (month < 1 || month > 12) {
    throw new BadRequest(
      'Invalid Date! Month can be in the range from 1 to 12.'
    );
  }

  const allTransaction = await Transaction.find({ owner }, ' -updatedAt');

  const startDate = new Date(year, month - 1, 1, 1);
  const endDate = new Date(year, month, 1, 0, 59, 59);

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
    data.reduce(
      (acc, transaction) => acc + formatNumber(transaction.amount),
      0
    );

  const totalIncome = getTotalAmount(getAllIncomeTransaction);
  const totalExpenses = getTotalAmount(getAllExpensesTransaction);
  const incomePerMonth = getTotalAmount(getAllIncomeTransactionPerMonth);
  const expensesPerMonth = getTotalAmount(getAllExpensesTransactionPerMonth);
  const balancePerMont = incomePerMonth - expensesPerMonth;

  const amountByTransaction = transaction => {
    const data = transaction.reduce((acc, transaction) => {
      const id = transaction.category._id;
      const sameTransaction = acc.find(element => element.category._id === id);

      if (sameTransaction !== undefined) {
        sameTransaction.amount += transaction.amount;
      } else acc.push(transaction);

      return acc;
    }, []);

    return data;
  };

  const createCategoryObject = transaction => {
    const object = transaction.map(item => {
      const id = item.category._id;
      const name = item.category.name;
      const amount = item.amount;
      const color = item.category.color;
      return { id, name, amount, color };
    });
    return object;
  };

  const allDataExpensesByCategory = amountByTransaction(
    getAllExpensesTransaction
  );

  const allExpensesByCategory = createCategoryObject(allDataExpensesByCategory);

  const expensesDataByPeriod = amountByTransaction(
    getAllExpensesTransactionPerMonth
  );
  const expensesByPeriod = createCategoryObject(expensesDataByPeriod);

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
