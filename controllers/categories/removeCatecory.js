const { User } = require('../../models');
const { Conflict } = require('http-errors');

const removeCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { _id: owner, categories } = req.user;

  if (categoryId === '10') {
    throw new Conflict('You can not delete "Other expenses" category');
  }

  const checkCategories = categories.find(item => item._id === categoryId);

  if (!checkCategories) {
    throw new Conflict('The category you are trying to delete does not exists');
  }

  const update = [...categories].filter(item => {
    return item._id !== categoryId;
  });

  await User.findByIdAndUpdate(owner, { categories: update });

  res.status(204).json('No content');
};
module.exports = removeCategory;
