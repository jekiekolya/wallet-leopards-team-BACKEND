const { User } = require('../../models');

const updateSubscription = async (req, res) => {
  const { _id, email } = req.user;

  const user = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      user: {
        _id,
        email,
        subscription: user.subscription,
      },
    },
  });
};

module.exports = updateSubscription;
