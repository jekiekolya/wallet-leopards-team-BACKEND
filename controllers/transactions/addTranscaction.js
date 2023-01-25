const { Transaction } = require('../../models');
const { BadRequest } = require('http-errors');

const addTransaction = async (req, res) => {
  const { _id: owner } = req.user;

  const { transactionType, idCategory } = req.body;

  if (!transactionType && !idCategory) {
    throw new BadRequest('Please choose the costs category');
  }

  const result = await Transaction.create({ ...req.body, owner });

  res.status(201).json(result);
};

module.exports = addTransaction;
