const express= require('express');
const router = express.Router({mergeParams:true});
const asyncHandler = require("express-async-handler");
const validateComment = require("../middleware/commentValidate");
const commentSchema = require("../models/comment");
const listingSchema = require("../models/listing");
const mongoose = require("mongoose");


router.post(
    "/",
    validateComment,
    asyncHandler(async (req, res) => {
      const pin = await listingSchema.findById(req.params.id);
      const newComment = new commentSchema(req.body.comment);
      pin.comments.push(newComment);
      await pin.save();
      await newComment.save();
      res.redirect(`/pins/${req.params.id}`);
    })
  );
  
  router.delete('/:commentId', asyncHandler(async (req, res) => {
    const { id, commentId } = req.params;
  
    // Update listingSchema to remove the comment reference
    await listingSchema.findByIdAndUpdate(id, { $pull: { comments: commentId } });
  
    // Delete the comment using commentId
    const deletedComment = await commentSchema.findByIdAndDelete(commentId);
  
    // req.flash('success','Review Deleted');
    console.log(deletedComment);
    res.redirect(`/pins/${id}`);
  }));
  
module.exports=router;