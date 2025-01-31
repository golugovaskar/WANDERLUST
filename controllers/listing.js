const { query } = require("express");
const Listing = require("../Models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  // console.log(allListings);
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  console.log(listing);
  if (!listing) {
    req.flash("error", "Listing is not found!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  // Log the request body to check what is being passed from the form
  console.log("Request body: ", req.body);

  // Check if the title is missing or the listing object is incomplete
  if (!req.body.listing || !req.body.listing.title) {
    req.flash("error", "Title is required");
    return res.redirect('/listings/new');
  }

  // Handle file upload (optional image)
  let url = req.file ? req.file.path : null;
  let filename = req.file ? req.file.filename : null;

  // Create a new listing object using the data passed from the form
  const newListing = new Listing(req.body.listing);

  // Set the owner to the currently logged-in user's ID
  newListing.owner = req.user._id;

  // If an image was uploaded, attach the image URL and filename to the listing object
  if (url && filename) {
    newListing.image = { url, filename };
  }

  // Save the new listing to the database
  await newListing.save();

  // Flash a success message and redirect to the listings page
  req.flash("success", "New listing created");
  res.redirect('/listings');
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // Handle image upload for updating the listing
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
