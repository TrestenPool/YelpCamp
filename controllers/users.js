const User = require('../models/user');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

module.exports.renderRegisterForm = (req, res) => {
  res.render('auth/register');
}

module.exports.processRegisterForm = async (req, res) => {
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
}

module.exports.renderLoginPage = async(req, res) => {
  // try to get the page the user was at last and return them there. If none specified, then go back to index page for campgrounds

  // check if the user is already logged in 
  if(req.isAuthenticated()){
    req.flash('error', 'You are already signed in... If you want to sign in with a different account you must logout then login');
    return res.redirect('/campgrounds');
  }

  res.render('auth/login');
}

module.exports.processLoginForm = async(req, res) => {
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
};

module.exports.logout = (req, res, next) => {
  req.logOut(function(err){
    if(err){
      return next(err);
    }
    req.flash('success', 'You have successfully logged out');
    res.redirect('/campgrounds');
  });
};