const mongoose = require('mongoose');
const User = require('./user');
const commentSchema = mongoose.Schema({
    message: {type:String,},
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now 
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
