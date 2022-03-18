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
  // index page
  .get(catchAsync(campgroundController.index))
  // post request to insert a new campground
  .post(isLoggedIn, upload.array('campground[images]') , validateCampground, catchAsync(campgroundController.handleNewCampground));

/** RENDER NEW CAMPGROUND FORM **/
router.route('/new')
  .get(isLoggedIn, campgroundController.renderNewForm);

/** EDIT THE CAMPGROUND **/
router.route('/:id/edit')
  .get(isLoggedIn, isAuthor, catchAsync(campgroundController.renderEditForm))
  .patch(isLoggedIn, isAuthor, catchAsync(campgroundController.handleEditCampground));
  // .patch(isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundController.handleEditCampground));


/** RENDER/DELETE EXISTING CAMPGROUND **/
router.route('/:id')
  .get(catchAsync(campgroundController.renderShowPage))
  .delete(isLoggedIn, isAuthor, catchAsync(campgroundController.handleDeleteCampground));

// export the campground routes
module.exports = router;