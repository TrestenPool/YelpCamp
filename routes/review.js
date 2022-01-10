const express = require('express');
const router = express.Router({mergeParams: true});
const {validateReview, validateCampground} = require('../utils/validation');

/** REQUIRES **/
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

/**********************************/
/********** MODELS ****************/
/**********************************/
const Campground = require('../models/campground');
const Review = require('../models/review');


/**********************************/
/************** ROUTES ***********/
/**********************************/

/** POST REQUEST TO INSERT A REVIEW **/
router.post('/', validateReview, catchAsync(async (req, res) => {

  // search for the campground by id
  const campground = await Campground.findById(req.params.id);

  // campground not found
  if (!campground) {
    throw new ExpressError(`Campground ID: ${req.params.id} was not found.`, 400);
  }

  // create the new review and add it to the campground reviews array
  const review = new Review(req.body.review);
  campground.reviews.push(review);

  // // save in the db
  await review.save();
  await campground.save();

  req.flash('success', 'Successfully added review');

  // redirect to the show page of the 
  res.redirect(`/campgrounds/${req.params.id}`);
}));

/** DELETE REQUEST TO DELETE A REVIEW **/
router.delete('/:reviewID', catchAsync( async (req,res) => {
  // destructure parameters
  const {id, reviewID} = req.params;

  // removes the review from the reviews array in the campground object
  await Campground.findByIdAndUpdate(id, { $pull: {reviews: reviewID} });

  // removes the review from the review collection
  await Review.findByIdAndDelete(reviewID);

  req.flash('success', 'Deleted review');

  // redirect to the show page
  res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;