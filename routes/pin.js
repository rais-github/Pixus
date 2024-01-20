const express = require("express");
const router = express.Router();
const multer  = require('multer')
const {storage}=require('../cloudConfig.js');
const upload = multer({ storage })
const asyncHandler = require("express-async-handler");
const validatePin = require("../middleware/pinValidate");
const { isLoggedIn } = require("../middleware/login");
const { isOwner } = require("../middleware/isOwner");
const pinController = require("../controllers/pins");


router.route("/")
  .get(asyncHandler(pinController.getAllPins))
  .post(isLoggedIn,upload.single('pins[image]'), validatePin, asyncHandler(pinController.createNewPin));

router.route("/new")
  .get(isLoggedIn, asyncHandler(pinController.renderNewPinForm));

router.route("/:id")
  .get(asyncHandler(pinController.getPinById))
  .put(isLoggedIn, isOwner,upload.single('pins[image]'), validatePin, asyncHandler(pinController.updatePin))
  .delete(isLoggedIn, isOwner, asyncHandler(pinController.deletePin));

router.route("/:id/edit")
  .get(isLoggedIn, isOwner, asyncHandler(pinController.renderEditPinForm));

module.exports = router;
