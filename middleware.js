
const Listing = require("./Models/listing");
const Review = require("./Models/review");
const ExpressError = require("./Utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// Enhanced validateListing middleware
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  // Check for Joi schema validation errors
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }

  // Additional field-specific validation (e.g., ensuring title and price exist)
  const { listing } = req.body;
  if (!listing || !listing.title) {
    req.flash("error", "Title is required");
    return res.redirect("/listings/new");
  }
  if (!listing.price || isNaN(listing.price)) {
    req.flash("error", "Valid price is required");
    return res.redirect("/listings/new");
  }
  if (!listing.country) {
    req.flash("error", "Country is required");
    return res.redirect("/listings/new");
  }
  if (!listing.location) {
    req.flash("error", "Location is required");
    return res.redirect("/listings/new");
  }

  next();
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
