const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require("./ExpressError");

const { campgroundSchema, reviewSchema } = require('./schemas');

/* CHECK IF THE USER IS LOGGED IN */
module.exports.isLoggedIn = async(req, res, next) => {
  // caches the website to return back to after logging in
  req.session.returnTo = req.originalUrl;

  // the user is not logged in, redirect to login page
  if(!req.isAuthenticated()){
    req.flash('error', 'you must be signed in');
    return res.redirect('/login');
  }
  else{
    return next();
  }
}

/* CHECK IF THE USER IS THE AUTHOR OF THE CAMPGROUND */
module.exports.isAuthor = async(req, res, next) => {
  // get the campground ID
  const {id} = req.params;

  // get the campground from the db
  const campFind = await Campground.findById({ _id: id });

  // check if the campground author is the same as the user that is logged in
  if(!campFind.author.equals(req.user._id)){
    // redirect to the show page with flash error
    req.flash('error', 'You do not have required access to perform this function...');

    // redirect them back to the show page for the campground they were trying to access
    return res.redirect(`/campgrounds/${id}`);
  }

  // the user is the author for the site...
  return next();
}

/* CHECK IF THE USER IS THE AUTHOR OF THE REVIEW */
module.exports.isReviewAuthor = async(req, res, next) => {
  // destructure the parameters passed in
  const {id, reviewID} = req.params;

  // get the review from the db
  const review = await Review.findById(reviewID);

  // check if the review author is equal to the current user id
  if(!review.author.equals(req.user._id)){
    req.flash('error', 'You must be the author of the review in order to modify/delete it!');
    // redirect to the show page for the campground
    return res.redirect(`/campgrounds/${id}`);;
  }
  else{
    return next();
  }

}

/**********************************/
/********** JOI VALIDATION ********/
/**********************************/
module.exports.validateCampground = (req, res, next) => {
  // attemmpt to validate with the schema
  const { error } = campgroundSchema.validate(req.body);

  // there was an error in validation
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400);
  }
  // there was not an error in validation
  else {
    next();
  }
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400);
  }
  else {
    next();
  }
}