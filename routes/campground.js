const express = require('express');
const router = express.Router();
const campgroundController = require('../controllers/campground');

/** REQUIRES **/
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {isLoggedIn, isAuthor, validateCampground, validateReview} = require('../utils/middleware');

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
  .get(catchAsync(campgroundController.index))
  .post(isLoggedIn ,validateCampground, catchAsync(campgroundController.handleNewCampground));

/** NEW CAMPGROUND **/
router.route('/new')
  .get(isLoggedIn, campgroundController.renderNewForm);


/** EDIT THE CAMPGROUND **/
router.route('/:id/edit')
  .get(isLoggedIn, isAuthor, catchAsync(campgroundController.renderEditForm))
  .patch(isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundController.handleEditCampground));

/** RENDER/DELETE EXISTING CAMPGROUND **/
router.route('/:id')
  .get(catchAsync(campgroundController.renderShowPage))
  .delete(isLoggedIn, isAuthor, catchAsync(campgroundController.handleDeleteCampground));

// export the campground routes
module.exports = router;