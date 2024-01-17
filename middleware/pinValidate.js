const {pinSchema} = require('../joiSchema');
const ExpressError = require('../utils/ExpressError')

const validatePin = (req, res, next) => {
    const { error } = pinSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

  module.exports=validatePin;
