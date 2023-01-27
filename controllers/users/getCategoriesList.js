const getCategoriesList = (req, res) => {
  const { categories } = req.user;

  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      categories,
    },
  });
};

module.exports = getCategoriesList;
