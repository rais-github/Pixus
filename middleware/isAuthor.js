const Review=require('../models/comment')
module.exports.isReviewAuthor= async(req,res,next)=>{
    let { id , commentId} = req.params;
    let review = await Review.findById(commentId);
    if(!review.author.equals(res.locals.currentUser._id))
    {
        req.flash("error","You are not the author");
        return res.redirect(`/pins/${id}`);
    }

    next();
}