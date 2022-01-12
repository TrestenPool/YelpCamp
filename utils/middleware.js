/******* MIDDLEWARE *******/

const isLoggedIn = async(req, res, next) => {
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




module.exports = {
  isLoggedIn
};