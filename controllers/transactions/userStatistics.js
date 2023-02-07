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

  const startDate = new Date(year, month - 1, 1, 1);
  const endDate = new Date(year, month, 1, 0, 59, 59);

  const expensesByPeriodFromBD = await Transaction.aggregate([
    {
      $match: {
        owner,
        transactionType: false,
        date: {
          $gt: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: '$category',
        totalSum: { $sum: '$amount' },
      },
    },
  ]);

  const incomePerMonthFromBD = await Transaction.aggregate([
    {
      $match: {
        owner,
        transactionType: true,
        date: {
          $gt: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSum: { $sum: '$amount' },
      },
    },
  ]);

  const expensePerMonthFromBD = await Transaction.aggregate([
    {
      $match: {
        owner,
        transactionType: false,
        date: {
          $gt: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSum: { $sum: '$amount' },
      },
    },
  ]);

  const allExpensesByCategoryFromBD = await Transaction.aggregate([
    {
      $match: {
        owner,
        transactionType: false,
      },
    },
    {
      $group: {
        _id: '$category',
        totalSum: { $sum: '$amount' },
      },
    },
  ]);

  const totalIncomeFromBD = await Transaction.aggregate([
    {
      $match: {
        owner,
        transactionType: true,
      },
    },
    {
      $group: {
        _id: null,
        totalSum: { $sum: '$amount' },
      },
    },
  ]);

  const totalExpensesFromBD = await Transaction.aggregate([
    {
      $match: {
        owner,
        transactionType: false,
      },
    },
    {
      $group: {
        _id: null,
        totalSum: { $sum: '$amount' },
      },
    },
  ]);

  const expensesByPeriod = expensesByPeriodFromBD.map(({ _id, totalSum }) => {
    const expensesByCategory = {
      id: _id._id,
      name: _id.name,
      amount: totalSum,
      color: _id.color,
    };

    return expensesByCategory;
  });

  const allExpensesByCategory = allExpensesByCategoryFromBD.map(
    ({ _id, totalSum }) => {
      const totalExpensesByCategory = {
        id: _id._id,
        name: _id.name,
        amount: totalSum,
        color: _id.color,
      };

      return totalExpensesByCategory;
    }
  );

  const expensesPerMonth = expensePerMonthFromBD[0]?.totalSum ?? 0;
  const incomePerMonth = incomePerMonthFromBD[0]?.totalSum ?? 0;
  const totalIncome = totalIncomeFromBD[0]?.totalSum ?? 0;
  const totalExpenses = totalExpensesFromBD[0]?.totalSum ?? 0;

  const balancePerMont = formatNumber(incomePerMonth - expensesPerMonth);

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
