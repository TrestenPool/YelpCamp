/*** REQUIRE'S ***/
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const method = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const flash = require('connect-flash');
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');

/** CONNECTION TO MONGO DB **/
mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true })
  .then(() => {
    console.log(`Connected to mongodb`);
  })
  .catch((err) => {
    console.log(`MongoDB Error connecting to mongodb`);
    console.log(`${err}`);
  });

const portNumber = 3000;
app.listen(portNumber, () => {
  console.log(`Listening on port ${portNumber}`);
})

/** CONFIGURATION **/
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(method('_method')); 
app.engine('ejs', ejsMate);
app.use(cookieParser('secret'));
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
app.use( expressSession(sessionOptions) );
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

/** Flash **/
app.use( (req, res, next) => {
  // set the local variables for all routes to have success and error
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})


/**********************************/
/************** ROUTES ***********/
/**********************************/

//home route
app.get('/', (req,res) => {
  res.render('home');
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

/* 404 route does not exist */
app.all('*', (req, res, next) => {
  const err = new ExpressError('Page not found', 404);
  next(err);
})

// Parsing errors
app.use((err, req, res, next) => {

  if (err.name === 'ValidationError') {
    // handle validation error here
  }
  else if (err.name === 'CastError') {
    // handle CastError error here
  }
  else {
    // handle Unknown error here
  }

  // pass onto the next error handler
  next(err);
});

/** Custom Error hander **/
app.use((err, req, res, next) => {
  if (!err.message) {
    err.message = "Default Error message";
  }
  if (!err.status) {
    err.status = 500;
  }

  res.status(err.status).render('error', { err });
});