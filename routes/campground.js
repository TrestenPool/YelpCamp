const express = require('express');
const router = express.Router();

/** REQUIRES **/
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {validateCampground, validateReview} = require('../utils/validation');
const {isLoggedIn} = require('../utils/middleware');

/**********************************/
/********** MODELS ****************/
/**********************************/
const Campground = require('../models/campground');
const Review = require('../models/review');


/**********************************/
/************** ROUTES ***********/
/**********************************/

/*** INDEX PAGE ***/
router.get('/', isLoggedIn, catchAsync(async (req, res) => {
  // get all campgrounds, sort by title
  const campgrounds = await Campground.find({}).sort({ title: "ascending" })

  // no campgrounds were fetched
  if (!campgrounds) {
    throw new ExpressError('No campgrounds were found..', 400);
  }
  else {
    // render the index view of the campgrounds
    res.render('campgrounds/index', { campgrounds });
  }

}));

/*** FORM TO CREATE A NEW CAMPGROUND ***/
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

/*** POST REQUEST TO INSERT NEW CAMPGROUND ***/
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
  let campground = new Campground(req.body.campground);
  campground = await campground.save();
  req.flash('success', 'Successfully created a new campground');

  // redirect to the show page 
  res.redirect(`/campgrounds/${campground._id}`);
}));

/*** FORM TO EDIT A CAMPGROUND ***/
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // get the campground from the db
  const camp = await Campground.findById({ _id: id })

  // campground does not exist
  if (!camp) {
    return next(new ExpressError(`The ID:${id} was not found...`), 400);
  }
  else {
    // render the edit page for the campground
    res.render('campgrounds/edit', { camp })
  }

}));

/*** PATCH REQUEST TO EDIT A CAMPGROUND ***/
router.patch('/:id/edit',  isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
  // get the campground id from the url parameters
  const { id } = req.params;

  // search for the campground by its id
  const campFind = await Campground.findById({ _id: id });

  // update the campground in the db
  const campground = await Campground.findByIdAndUpdate({ _id: id }, { ...req.body.campground }, { runValidators: true, returnOriginal: false });

  // campground was successfully updated
  req.flash('success', 'Successfully updated the campground');

  // redirect to the show page for the campground
  res.redirect(`/campgrounds/${id}`);
}));


/*** DELETE CAMP ***/
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
  // get the id from the url parameters
  const { id } = req.params;

  // attempts to delete by the id
  const camp = await Campground.findByIdAndDelete({ _id: id });

  // camp was not found
  if (!camp) {
    req.flash('error', `Error deleting campground with ID: ${id}`);
  }
  else {
    req.flash('success', `Successfully deleted ${camp.title}`);
  }

  // redirect to the index page
  res.redirect('/campgrounds'); 

}));

/*** SHOW PAGE ***/
router.get('/:id', isLoggedIn, catchAsync(async (req, res, next) => {
  // get the id from the url parameters
  const { id } = req.params;

  // search for the camp in the db
  const camp = await Campground.findById({ _id: id }).populate('reviews');

  // campground was not found 
  if (!camp) {
    // throw new ExpressError(`The campground with ID: ${id} was not found`);
    req.flash('error', `Campground of ID:${id} was not found.`);

    // redirect to the index page
    res.redirect('/campgrounds');
  }
  else {
    const {reviews} = camp;
    res.render('campgrounds/show', { camp, reviews }); // render the show page
  }
}));

// export the campground routes
module.exports = router;