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

/*** INDEX PAGE ***/
router.get('/', catchAsync(campgroundController.index));

/*** FORM TO CREATE A NEW CAMPGROUND ***/
router.get('/new', isLoggedIn, campgroundController.renderNewForm);

/*** POST REQUEST TO INSERT NEW CAMPGROUND ***/
router.post('/', isLoggedIn ,validateCampground, catchAsync(campgroundController.handleNewCampground));

/*** FORM TO EDIT A CAMPGROUND ***/
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.renderEditForm));

/*** PATCH REQUEST TO EDIT A CAMPGROUND ***/
router.patch('/:id/edit', isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundController.handleEditCampground));

/*** DELETE CAMP ***/
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgroundController.handleDeleteCampground));

/*** SHOW PAGE ***/
router.get('/:id', catchAsync(campgroundController.renderShowPage));

// export the campground routes
module.exports = router;