if (process.env.NODE_ENV != "production") {
  const dotenv = require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const eMate = require("ejs-mate");
const methodOverride = require("method-override");
const asyncHandler = require("express-async-handler");

const comments = require("./routes/comments");
const pins = require("./routes/pin");
const ExpressError = require("./utils/ExpressError");

const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/pixus";
const PORT = process.env.PORT || 3000;

app.engine("ejs", eMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main()
  .then((res) => {
    console.log("Connection to DB successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Root Route");
});

app.use("/pins", pins);

app.use("/pins/:id/comments", comments);

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
