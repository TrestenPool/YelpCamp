// require the environement variables if we are not in production
if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}

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
const https = require('https');
const fs = require('fs');
// passport
const passport = require('passport');
const LocalStrategy = require('passport-local');
// routes
const campgroundRoutes = require('../routes/campground');
const reviewRoutes = require('../routes/review');
const userRoutes = require('../routes/users');
// mongo sanitization
const mongoSanitize = require('express-mongo-sanitize');
// helmet
const helmet = require("helmet");
// mongo store
const mongoStore = require('connect-mongo')


// db connection string
const db_url = process.env.DB_URL;
const secret = process.env.SECRET || 'thisisnotagoodsecret';


// export our variables
module.exports = {
  express, app, path, mongoose, method, ejsMate, ExpressError, catchAsync, cookieParser, expressSession, flash, 
  passport, LocalStrategy, 
  campgroundRoutes, reviewRoutes, userRoutes,
}
 
/*****************************************************************/
/************************* CONFIGURATION *************************/
/*****************************************************************/
module.exports.configuration = function(){

  //configure mongo db
  mongoose.connect(db_url, 
    {
     useNewUrlParser: true ,
     ssl: true,
     sslValidate: true,
     sslCA: `/home/ec2-user/global-bundle.pem`
    })
    .then(() => {
      console.log(`Connected to mongodb`);
    })
    .catch((err) => {
      console.log(`There was an error connecting to MongoDB 2`);
      console.log(`${err}`);
    });

  // configure https
  // https
  //   .createServer(
  //     {
  //       key: fs.readFileSync("Openssl/server.key"),
  //       cert: fs.readFileSync("Openssl/server.cert"),
  //     },
  //     app
  //   )


  // PORT will be set by Heroku, or default to 3000
  // const portNumber = process.env.PORT || 3000;
  const portNumber = 8080
  
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
  app.use(cookieParser(secret));

  // session configuration
  const sessionOptions = {
    name: 'Yelp-Camp-Session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      // secure: true,
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: mongoStore.create({
      mongoUrl: db_url, 
      touchAfter: 24*36000
    })};

  // sessions
  app.use(expressSession(sessionOptions));

  // serve the public directory
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

  /** Navbar register,login,logout **/
  app.use( (req, res, next) => {
    // pass the current user to all the views in case we need to use it 
    res.locals.currentUser = req.user;
    return next();
  })

  /** Mongo Sanitzization **/
  app.use(mongoSanitize({
    replaceWith: '_'
  }));

  // append url to this list of js libraries
  const scriptSrcUrls = [
      "https://stackpath.bootstrapcdn.com",
      "https://api.tiles.mapbox.com",
      "https://api.mapbox.com",
      "https://kit.fontawesome.com",
      "https://cdnjs.cloudflare.com",
      "https://cdn.jsdelivr.net",
  ];
  // append url to this list of css libraries
  const styleSrcUrls = [
      "https://kit-free.fontawesome.com",
      "https://stackpath.bootstrapcdn.com",
      "https://api.mapbox.com",
      "https://api.tiles.mapbox.com",
      "https://fonts.googleapis.com",
      "https://use.fontawesome.com",
      "https://cdn.jsdelivr.net"
  ];
  // append url to this list of api domains
  const connectSrcUrls = [
      "https://api.mapbox.com",
      "https://*.tiles.mapbox.com",
      "https://events.mapbox.com",
  ];
  const fontSrcUrls = [];
  app.use(
      helmet.contentSecurityPolicy({
          directives: {
              defaultSrc: [],
              connectSrc: ["'self'", ...connectSrcUrls],
              scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
              styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
              workerSrc: ["'self'", "blob:"],
              childSrc: ["blob:"],
              objectSrc: [],
              imgSrc: [
                  "'self'",
                  "blob:",
                  "data:",
                  "https://res.cloudinary.com/udemy-colt-steele-course/",
                  "https://images.unsplash.com",
              ],
              fontSrc: ["'self'", ...fontSrcUrls],
          },
      })
  );

}// end of configuration
