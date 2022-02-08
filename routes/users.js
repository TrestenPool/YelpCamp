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


/**************************0**********/
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

    // register the new user
    const registeredUser = await User.register(user, password);

    // attempt to login in the user
    req.login(registeredUser, (err) => {
      // throw an error to our error handler
      if(err){
        throw new ExpressError(`There was an error trying to login after registration ${err}`, 400);
      }
    })

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
  // flash message they will see if they were able to successfully login
  req.flash('success', 'Welcome back!!');

  // redirect the user to the page they visited before this
  if(req.session.returnTo){
    // remove the returnTo key from the session 
    var previousUrl = req.session.returnTo;
    delete req.session.returnTo;
    return res.redirect(previousUrl);
  }
  else{
    return res.redirect('/campgrounds');
  }
}));

/** LOGOUT **/
router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success', 'You have successfully logged out');

  res.redirect('/campgrounds');
})

// export the router
module.exports = router;