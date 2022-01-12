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
/*************** ROUTES *************/
/************************************/

/******  REGISTER ******/
/** Show the form **/
router.get('/register', (req, res) => {
  res.render('auth/register');
})
/** Process the form **/
router.post('/register', catchAsync(async (req, res) => {
  try{
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.flash('success', 'Congrats you are now registered for Yelp-Camp!!!');
    res.redirect('/campgrounds');
  }
  catch(error){
    req.flash('error', error.message);
    res.redirect('/register');
  }
}));


/******  LOGIN ******/
/** Show the login page **/
router.get('/login', catchAsync(async(req, res) => {
  res.render('auth/login');
}));

/** Process the login page **/
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), catchAsync(async(req, res) => {
  req.flash('success', 'Welcome back!!');
  res.redirect('/campgrounds');
}));

// test the isloggedin function
router.get('/new', isLoggedIn, (req, res) => {
  res.send('Nice page isnt it');
})

// export the router
module.exports = router;