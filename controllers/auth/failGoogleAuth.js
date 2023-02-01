const failGoogleAuth = async (req, res) => {
  res.status(409).json({
    status: 'Conflict',
    message: 'Content of request conflicted with server parameters',
  });
};

module.exports = failGoogleAuth;
