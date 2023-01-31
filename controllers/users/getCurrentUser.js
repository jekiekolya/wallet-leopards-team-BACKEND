const getCurrentUser = (req, res) => {
  const { _id, email, subscription, firstName } = req.user;

  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      user: {
        _id,
        firstName,
        email,
        subscription,
      },
    },
  });
};

module.exports = getCurrentUser;
