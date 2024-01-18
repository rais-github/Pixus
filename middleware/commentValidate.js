const {commentSchema} = require('../joiSchema');
const ExpressError = require('../utils/ExpressError')

const validateComment=(req,res,next)=>{
    const {error} = commentSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(',');
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  }

  module.exports=validateComment;