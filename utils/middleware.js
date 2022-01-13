/******* MIDDLEWARE *******/

// check if a user has logged in
module.exports.isLoggedIn = async(req, res, next) => {
  req.session.returnTo = req.originalUrl;

  // the user is not logged in
  if(!req.isAuthenticated()){
    req.flash('error', 'you must be signed in');
    return res.redirect('/login');
  }
  else{
    // continue onto the page
    return next();
  }
}
