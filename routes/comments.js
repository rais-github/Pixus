const express = require('express');
const router = express.Router({ mergeParams: true });
const asyncHandler = require("express-async-handler");
const validateComment = require("../middleware/commentValidate");
const { isLoggedIn } = require('../middleware/login');
const { isReviewAuthor } = require('../middleware/isAuthor');
const commentController = require("../controllers/comment");

router.post("/", isLoggedIn, validateComment, asyncHandler(commentController.addComment));

router.delete('/:commentId', isReviewAuthor, asyncHandler(commentController.deleteComment));

module.exports = router;
