const express = require('express');
const router = express.Router({mergeParams: true});
const {validateCampground ,validateReview, isLoggedIn, isReviewAuthor} = require('../utils/middleware');

/** REQUIRES **/
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

/**********************************/
/********** MODELS ****************/
/**********************************/
const Campground = require('../models/campground');
const Review = require('../models/review');

/**********************************/
/********** CONTROLLER ************/
/**********************************/
const reviewController = require('../controllers/review');

/**********************************/
/************** ROUTES ***********/
/**********************************/

/** POST REQUEST TO INSERT A REVIEW **/
router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.createReview));

/** DELETE REQUEST TO DELETE A REVIEW **/
router.delete('/:reviewID', isLoggedIn, isReviewAuthor, catchAsync());


// export the router
module.exports = router;