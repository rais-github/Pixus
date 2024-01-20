if (process.env.NODE_ENV != "production") {
  const dotenv = require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const eMate = require("ejs-mate");
const methodOverride = require("method-override");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash= require('connect-flash');


const comments = require("./routes/comments");
const pins = require("./routes/pin");
const userRouter=require('./routes/user.js');
const ExpressError = require("./utils/ExpressError");

const app = express();
// const MONGO_URL = "mongodb://127.0.0.1:27017/pixus";
const PORT = process.env.PORT || 3000;

const dbURL= process.env.ATLAS_URL;

const store =MongoStore.create({
  mongoUrl:dbURL,
  crypto:{
    secret:"f-17vv",
  },
  touchAfter:24*3600
});

store.on("error",function(){
  console.log("ERROR_IN_MONGO_SESSION_STORE");
})


app.engine("ejs", eMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const sessionOption = {
  secret:process.env.SESSION_KEY,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7*24*60*60*1000, 
    maxAge:7 * 24 * 60 * 60 * 1000, 
    httpOnly:true
  }
}

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
  .then((res) => {
    console.log("Connection to DB successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbURL);
}

app.get("/", (req, res) => {
  res.redirect("/pins");
});
app.use((req,res,next)=>{
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  res.locals.currentUser=req.user;
  next();
})

app.use("/pins", pins);

app.use("/pins/:id/comments", comments);

app.use('/',userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).render("pins/err.ejs", { statusCode, message });
});

app.listen(PORT, function () {
  console.log(`Server Responding to port:${PORT}`);
});
