const express = require('express');
const router = express.Router();
const campgroundController = require('../controllers/campground');

/** REQUIRES **/
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {isLoggedIn, isAuthor, validateCampground, validateReview} = require('../utils/middleware');

// multer
const multer  = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({ storage })

/**********************************/
/********** MODELS ****************/
/**********************************/
const Campground = require('../models/campground');
const Review = require('../models/review');

/**********************************/
/************** ROUTES ***********/
/**********************************/

/** INDEX **/
router.route('/')
  // index page for all the campgrounds
  .get(catchAsync(campgroundController.index))

  // inserts a new campground. campground[images] will be uploaded to the cloudinary site
  .post(isLoggedIn, upload.array('campground[images]') , validateCampground, catchAsync(campgroundController.handleNewCampground));



/** RENDER NEW CAMPGROUND FORM **/
router.route('/new')
  .get(isLoggedIn, campgroundController.renderNewForm);



/** EDIT THE CAMPGROUND **/
router.route('/:id/edit')
  // render the edit form 
  .get(isLoggedIn, isAuthor, catchAsync(campgroundController.renderEditForm))

  // process the edit form for the campground
  .patch(isLoggedIn, isAuthor, upload.array('newImages'), validateCampground, catchAsync(campgroundController.handleEditCampground));



/** RENDER/DELETE EXISTING CAMPGROUND **/
router.route('/:id')
  .get(catchAsync(campgroundController.renderShowPage))

  .delete(isLoggedIn, isAuthor, catchAsync(campgroundController.handleDeleteCampground));



// export the campground routes
module.exports = router;