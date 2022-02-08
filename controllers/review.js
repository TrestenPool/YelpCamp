const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
  // get the campground id
  const {id} = req.params.id;
  
  // get the campground from the db
  const campground = await Campground.findById(req.params.id);

  // the campground does not exist, throw error
  if (!campground) {
    throw new ExpressError(`Campground ID: ${req.params.id} was not found.`, 400);
  }

  // first create the review object
  const review = new Review(req.body.review);

  // set the review author the user that is currently logged in
  review.author = req.user._id;

  // add the reviews to the campground reviews array
  campground.reviews.push(review);

  // save the reivew in the review collection, and re-save the campground with updated reviews array
  await review.save();
  await campground.save();

  // redirect to the show page for the campground
  req.flash('success', 'Successfully added review');
  res.redirect(`/campgrounds/${req.params.id}`);
}

module.exports.deleteReview =  async (req,res) => {
  // destructure parameters
  const {id, reviewID} = req.params;

  // removes the review from the reviews array in the campground object
  await Campground.findByIdAndUpdate(id, { $pull: {reviews: reviewID} });

  // removes the review from the review collection
  await Review.findByIdAndDelete(reviewID);

  // flash success message
  req.flash('success', 'Successfully deleted review');

  // redirect to the show page
  res.redirect(`/campgrounds/${id}`);
}