/*** REQUIRE'S ***/
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const method = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./ExpressError');
const catchAsync = require('./catchAsync');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const flash = require('connect-flash');

// passport
const passport = require('passport');
const LocalStrategy = require('passport-local');

// routes
const campgroundRoutes = require('../routes/campground');
const reviewRoutes = require('../routes/review');
const userRoutes = require('../routes/users');

module.exports = {
  express, app, path, mongoose, method, ejsMate, ExpressError, catchAsync, cookieParser, expressSession, flash, 
  passport, LocalStrategy, 
  campgroundRoutes, reviewRoutes, userRoutes
}


/*****************************************************************/
/************************* CONFIGURATION *************************/
/*****************************************************************/
module.exports.configuration = function(){

  //configure mongo db
  mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true })
    .then(() => {
      console.log(`Connected to mongodb`);
    })
    .catch((err) => {
      console.log(`MongoDB Error connecting to mongodb`);
      console.log(`${err}`);
    });

  // set our app to listen for incoming connections
  const portNumber = 3000;
  app.listen(portNumber, () => {
    console.log(`Listening on port ${portNumber}`);
  })

  // setup the views directory
  app.set('views', path.join(__dirname, '../views'))
  app.set('view engine', 'ejs');

  // setup parsing
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // ejs and method override
  app.use(method('_method'));
  app.engine('ejs', ejsMate);

  // cookies
  app.use(cookieParser('secret'));

  // session configuration
  const sessionOptions = {
    secret: 'thisisnotagoodsecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  };

  // sessions
  app.use(expressSession(sessionOptions));
  app.use(express.static(path.join(__dirname, '../public')));

  // flash
  app.use(flash());

  // configure passport
  const User = require('../models/user');
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());


  /** Flash **/
  app.use((req, res, next) => {
    // set the local variables for all routes to have success and error
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
  })

}// end of configuration
