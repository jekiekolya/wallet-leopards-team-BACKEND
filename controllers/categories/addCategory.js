const { User } = require('../../models');
const uniqid = require('uniqid');

const addCategory = async (req, res) => {
  const { category } = req.body;
  const { _id: owner, categories } = req.user;

  const checkCategories = categories.find(item => item.name === category);
  if (checkCategories) {
    res.status(409).json({
      status: 'failure',
      code: 409,
      message: 'The category you are trying to add is already exists',
    });
    return;
  }
  const newCategory = { _id: uniqid(), name: category };
  const update = [...categories, newCategory];

  const result = await User.findByIdAndUpdate(
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
