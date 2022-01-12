/** Configure our app **/
const {configuration} = require('./utils/configuration');
configuration();

// get all the routes
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/review');
const campgroundRoutes = require('./routes/campground');

// requires
const ExpressError = require('./utils/ExpressError');
const {app} = require('./utils/configuration');

/**********************************/
/************** ROUTES ***********/
/**********************************/
//home route
app.get('/', (req,res) => {
  res.render('home');
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

/* 404 route does not exist */
app.all('*', (req, res, next) => {
  const err = new ExpressError('Page not found', 404);
  next(err);
})

/** Custom Error hander **/
app.use((err, req, res, next) => {
  // no error was supplied
  if (!err.message) {
    err.message = "Default Error message";
  }
  // no error status was supplied
  if (!err.status) {
    err.status = 500;
  }

  // render the error template with the error and error status
  res.status(err.status).render('error', { err });
});