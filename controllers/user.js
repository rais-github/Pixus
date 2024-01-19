const User = require('../models/user.js');

module.exports.signin= async(req,res)=>{
    try {
        let {username,email,password}=req.body;
        let newUser = new User({email,username});
        let registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash('success',"Welcome to Wanderpay");
            res.redirect('/pins');
        })
    } catch (error) {
        req.flash('error',error.message);
        res.redirect('/signup');
    }
}


module.exports.login=async(req,res)=>{
    let redirectURL = res.locals.redirectUrl || '/pins'
    req.flash('success',"Welcome back");
    res.redirect(redirectURL);
}


module.exports.logout=(req,res,next)=>{
    req.logout(err=>{
        if(err){
            return next(err);
        }
        req.flash('success','You logged out');
        res.redirect('/pins');
    })
}