const getCurrentUser = (req, res) => {
  const {
    _id,
    firstName,
    email,
    avatarURL,
    categories,
    totalBalance,
    subscription,
  } = req.user;

  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      user: {
        _id,
        firstName,
        email,
        avatarURL,
        categories,
        subscription,
        totalBalance,
      },
    },
  });
};

module.exports = getCurrentUser;
