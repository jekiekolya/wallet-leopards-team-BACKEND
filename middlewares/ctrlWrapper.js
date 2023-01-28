const ctrlWrapper = ctrl => {
  return async (req, res, next) => {
    console.log(ctrl);
    try {
      await ctrl(req, res, next);
    } catch (error) {
      console.log('erron in wrapper');
      next(error);
    }
  };
};

module.exports = ctrlWrapper;
