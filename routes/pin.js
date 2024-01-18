const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const validatePin = require("../middleware/pinValidate");
const listingSchema = require("../models/listing");
const mongoose = require("mongoose");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const allPins = await listingSchema.find({});
    res.render("pins/index.ejs", { allPins });
  })
);

router.get(
  "/new",
  asyncHandler(async (req, res) => {
    res.render("pins/new.ejs");
  })
);

router.post(
  "/",
  validatePin,
  asyncHandler(async (req, res) => {
    const newPin = new listingSchema(req.body.pins);
    await newPin.save();
    res.redirect("/pins");
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    let { id } = req.params;
    const pin = await listingSchema.findById(id).populate("comments");
    res.render(`pins/show.ejs`, { pin });
  })
);

router.get(
  "/:id/edit",
  asyncHandler(async (req, res) => {
    const pin = await listingSchema.findById(req.params.id);
    res.render("pins/edit.ejs", { pin });
  })
);

router.put(
  "/:id",
  validatePin,
  asyncHandler(async (req, res) => {
    let { id } = req.params;
    const pin = await listingSchema.findByIdAndUpdate(id, { ...req.body.pins });
    await pin.save();
    res.redirect(`/pins/${id}`);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    let { id } = req.params;
    const pin = await listingSchema.findByIdAndDelete(id);
    console.log(pin);
    res.redirect("/pins");
  })
);

module.exports = router;
