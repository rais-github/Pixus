const Listing=require('../models/listing')
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash('error',"You don't have permission");
        return res.redirect(`/listings/${id}`);
    }
    next()
}