const listingSchema = require("../models/listing");
const asyncHandler = require("express-async-handler");

const getAllPins = async (req, res) => {
  const allPins = await listingSchema.find({});
  res.render("pins/index.ejs", { allPins });
};

const renderNewPinForm = (req, res) => {
  res.render("pins/new.ejs");
};

const createNewPin = async (req, res) => {
  const newPin = new listingSchema(req.body.pins);
  const { filename, path } = req.file;
  newPin.owner = req.user._id;
  newPin.image = { filename, url: path };
  await newPin.save();
  req.flash("success", "New pin created");
  res.redirect("/pins");
};

const getPinById = async (req, res) => {
  const { id } = req.params;
  const pin = await listingSchema
    .findById(id)
    .populate({ path: "comments", populate: { path: "author" } })
    .populate("owner");

  if (!pin) {
    req.flash("error", "Pin you requested for does not exist");
    res.redirect("/pins");
  }

  res.render(`pins/show.ejs`, { pin });
};

const renderEditPinForm = async (req, res) => {
  const pin = await listingSchema.findById(req.params.id);
  if (!pin) {
    req.flash("error", "Pin you requested for does not exist");
    res.redirect("/pins");
  }
  let orgimg = pin.image.url;
  orgimg = orgimg.replace("/upload", "/upload/w_250");
  res.render("pins/edit.ejs", { pin, orgimg });
};

const updatePin = async (req, res) => {
  const { id } = req.params;
  const pin = await listingSchema.findByIdAndUpdate(id, { ...req.body.pins });
  if (typeof req.file !== "undefined") {
    const { filename, path } = req.file;
    pin.image = { filename, url: path };
    await pin.save();
  }
  await pin.save();
  req.flash("success", "Listing Updated");
  res.redirect(`/pins/${id}`);
};

const deletePin = async (req, res) => {
  const { id } = req.params;
  const pin = await listingSchema.findByIdAndDelete(id);
  console.log(pin);
  req.flash("error", "Listing Deleted");
  res.redirect("/pins");
};

module.exports = {
  getAllPins,
  renderNewPinForm,
  createNewPin,
  getPinById,
  renderEditPinForm,
  updatePin,
  deletePin,
};
