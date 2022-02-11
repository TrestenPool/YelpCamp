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

/** REGISTER */
router.route('/register')
  .get(userController.renderRegisterForm)
  .post(catchAsync(userController.processRegisterForm));

/** LOGIN */
router.route('/login')
  .get(catchAsync(userController.renderLoginPage))
  .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), catchAsync(userController.processLoginForm));

/** LOGOUT **/
router.get('/logout', userController.logout);

// export the router
module.exports = router;