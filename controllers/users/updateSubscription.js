const { User } = require('../../models');
const { BadRequest } = require('http-errors');

const updateSubscription = async (req, res) => {
  const { _id, email, subscription } = req.user;
  const { subscription: newSubscription } = req.body;

  if (!updateSubscription || newSubscription === subscription) {
    throw new BadRequest('Incorrectly selected subscription');
  }

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
