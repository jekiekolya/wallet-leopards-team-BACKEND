const { User } = require('../../models');
const { BadRequest } = require('http-errors');

const updateName = async (req, res) => {
  const { _id, email, firstName } = req.user;
  const { firstName: newUsername } = req.body;

  if (newUsername === firstName) {
    throw new BadRequest(
      'Not possible to change the firstName to the same one'
    );
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
        firstName: user.firstName,
      },
    },
  });
};

module.exports = updateName;
