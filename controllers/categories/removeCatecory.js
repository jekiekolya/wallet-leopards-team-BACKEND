const { User } = require('../../models');
const removeCategory = async (req, res) => {
  const { category } = req.body;
  const { _id: owner, categories } = req.user;

  const checkCategories = categories.find(item => item.name === category);
  if (!checkCategories) {
    res.status(409).json({
      status: 'failure',
      code: 409,
      message: 'The category you are trying to delete is not exist',
    });
    return;
  }

  const update = [...categories].filter(item => {
    return item.name !== category;
  });
  console.log('hi');

  await User.findByIdAndUpdate(owner, { categories: update });

  res.status(204).json('No content');
};
module.exports = removeCategory;
