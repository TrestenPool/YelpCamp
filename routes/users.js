// requires
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const passport = require('passport');
const { isLoggedIn } = require('../utils/middleware');

/************************************/
/*************** MODELS *************/
/************************************/
const User = require('../models/user');

/************************************/
/*************** CONTROLLER *********/
/************************************/
const userController = require('../controllers/users');


/************************************/
/*************** ROUTES *************/
/************************************/

/******  REGISTER ******/
/** Show the form **/
router.get('/register', userController.renderRegisterForm);

/** Process the form **/
router.post('/register', catchAsync(userController.processRegisterForm));


/******  LOGIN ******/
/** Show the login page **/
router.get('/login', catchAsync(userController.renderLoginPage));

/** Process the login page **/
router.post('/login', userController.processRegisterForm);

/** LOGOUT **/
router.get('/logout', userController.logout);

// export the router
module.exports = router;