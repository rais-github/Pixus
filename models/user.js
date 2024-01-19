const mongoose = require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');

const userSchema =  new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Please enter your email"]
    }
})

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',userSchema);

