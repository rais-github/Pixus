const commentSchema = require("../models/comment");
const listingSchema = require("../models/listing");
const asyncHandler = require("express-async-handler");

const addComment = async (req, res) => {
  const pin = await listingSchema.findById(req.params.id);
  const newComment = new commentSchema(req.body.comment);
  newComment.author = req.user._id;
  pin.comments.push(newComment);
  await pin.save();
  await newComment.save();
  req.flash("success", "Added a Comment");
  res.redirect(`/pins/${req.params.id}`);
};

const deleteComment = async (req, res) => {
  const { id, commentId } = req.params;

  // Update listingSchema to remove the comment reference
  await listingSchema.findByIdAndUpdate(id, { $pull: { comments: commentId } });

  // Delete the comment using commentId
  const deletedComment = await commentSchema.findByIdAndDelete(commentId);

  // req.flash('success','Review Deleted');
  console.log(deletedComment);
  req.flash("error", "Comment removed");
  res.redirect(`/pins/${id}`);
};

module.exports = {
  addComment,
  deleteComment,
};
