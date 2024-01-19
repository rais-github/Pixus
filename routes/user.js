const express = require('express');
const Router = express.Router({ mergeParams: true });
const asyncHandler = require("express-async-handler");
const ExpressError = require('../utils/ExpressError.js');
const User = require('../models/user.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware/login.js');
const userController = require('../controllers/user.js');

Router.route('/signup')
  .get(asyncHandler(async (req, res) => {
    res.render('users/signup.ejs');
  }))
  .post(asyncHandler(userController.signin));

Router.route('/login')
  .get((req, res) => {
    res.render('users/login.ejs');
  })
  .post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login);

Router.get('/logout', userController.logout);

module.exports = Router;
