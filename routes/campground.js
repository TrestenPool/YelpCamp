const express = require('express');
const router = express.Router();

/** REQUIRES **/
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {validateCampground, validateReview} = require('../utils/validation');


/**********************************/
/********** MODELS ****************/
/**********************************/
const Campground = require('../models/campground');
const Review = require('../models/review');


/**********************************/
/************** ROUTES ***********/
/**********************************/

/*** INDEX PAGE ***/
router.get('/', catchAsync(async (req, res) => {
  // get all campgrounds, sort by title
  const campgrounds = await Campground.find({}).sort({ title: "ascending" })

  if (!campgrounds) {
    throw new ExpressError('No campgrounds were found..', 400);
  }
  else {
    // render the index view of the campgrounds
    res.render('campgrounds/index', { campgrounds });
  }

}));


/*** FORM TO CREATE A NEW CAMPGROUND ***/
router.get('/new', (req, res) => {
  res.render('campgrounds/new');
});

/*** POST REQUEST TO INSERT NEW CAMPGROUND ***/
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
  let campground = new Campground(req.body.campground);
  campground = await campground.save();
  req.flash('success', 'Successfully created a new campground');

  // redirect to the show page 
  res.redirect(`/campgrounds/${campground._id}`);
}));

/*** FORM TO EDIT A CAMPGROUND ***/
router.get('/:id/edit', catchAsync(async (req, res, next) => {
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
router.patch('/:id/edit', validateCampground, catchAsync(async (req, res, next) => {
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
router.delete('/:id', catchAsync(async (req, res) => {
  // get the id from the url parameters
  const { id } = req.params;

  // attempts to delete by the id
  const camp = await Campground.findByIdAndDelete({ _id: id });

  // camp was not founf
  if (!camp) {
    console.log(`Error deleting ID:${id} ${error}`);
  }
  else {
    console.log(`Success, deleted ${camp.title}`);
    res.redirect('/campgrounds'); // redirect back to the index page
  }

}));

/*** SHOW PAGE ***/
router.get('/:id', catchAsync(async (req, res, next) => {
  // get the id from the url parameters
  const { id } = req.params;

  // search for the camp in the db
  const camp = await Campground.findById({ _id: id }).populate('reviews');
  const {reviews} = camp;

  // campground was not found 
  if (!camp) {
    throw new ExpressError(`The campground with ID: ${id} was not found`);
  }
  else {
    res.render('campgrounds/show', { camp, reviews }); // render the show page
  }
}));

// export the thing
module.exports = router;