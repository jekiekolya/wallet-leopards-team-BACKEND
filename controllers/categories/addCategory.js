const { User } = require('../../models');
const uniqid = require('uniqid');
const { Conflict, BadRequest } = require('http-errors');
const generageRandomHexColor = require('../../helpers/generateRandomHexColor');

const addCategory = async (req, res) => {
  const { category } = req.body;
  const { _id: owner, categories } = req.user;
  const trimCategory = category.trim();

  if (trimCategory === '') {
    throw new BadRequest('The category is not allowed to be empty');
  }

  const checkCategories = categories.find(item => item.name === trimCategory);

  if (checkCategories) {
    throw new Conflict('The category you are trying to add already exists');
  }

  const newCategory = {
    _id: uniqid(),
    name: trimCategory,
    color: generageRandomHexColor(),
  };
  const update = [...categories, newCategory];

  await User.findByIdAndUpdate(
    owner,
    { categories: update },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: 'success',
    code: 201,
    message: 'New category successfully created',
    data: newCategory,
  });
};

module.exports = addCategory;
