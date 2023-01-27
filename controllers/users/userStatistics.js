const { User } = require('../../models');

const userStatistics = async (req, res) => {
  const { _id, email, firstName } = req.user;

  const user = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });

  console.log('user', user);

  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      user: {
        _id,
        email,
        firstName,
      },
    },
  });
};

module.exports = userStatistics;
