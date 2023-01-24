const getCurrentUser = (req, res) => {
  const { _id, email, subscription } = req.user;

  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      user: {
        _id,
        email,
        subscription,
      },
    },
  });
};

module.exports = getCurrentUser;
