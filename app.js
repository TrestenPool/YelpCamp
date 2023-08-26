// const express = require('express')
// const app = express()
// const port = 8080

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

// app.get('/', (req, res) => {
//   res.send('Hello new world!!')
// })
// console.log('Server running at http://127.0.0.1:' + port + '/');


// const mongoose = require('mongoose');
// const path = require('path');
// const connectionString = "mongodb://tresten:tresten-password@docdb-2023-08-26-21-17-31.ckpy8z21smjh.us-east-2.docdb.amazonaws.com:27017/?tls=true&tlsCAFile=global-bundle.pem&retryWrites=false"
// // const connectionString = "mongodb://tresten:tresten-password@docdb-2023-08-26-21-17-31.ckpy8z21smjh.us-east-2.docdb.amazonaws.com:27017/?tls=true&tls&retryWrites=false"
// const myvariable = path.join(__dirname, './global-bundle.pem')

// console.log(`HERE: ${myvariable}`);

// mongoose.connect(connectionString, {
//   tlsCAFile: path.join(__dirname, './global-bundle.pem'),
//   keepAlive: true
// })
//   .then( (response) => {
//     console.log("Connected to MongoDB");
//   })
//   .catch( (error) => {
//     console.log(`There was an error connecting to mongo${error}`);
//   })


/** Configure our app **/
const {configuration, app} = require('./utils/configuration');
configuration();

// get all the routes
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/review');
const campgroundRoutes = require('./routes/campground');

// requires
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');

/**********************************/
/************** ROUTES ***********/
/**********************************/

/** Home route **/
app.get(['/', '/home'], (req, res, next) => {
  res.render('home');
});

/** Campground routes */
app.use('/campgrounds', campgroundRoutes);

/** User routes **/
app.use('/', userRoutes);

/** Review routes **/
app.use('/campgrounds/:id/reviews', reviewRoutes);

/* 404 route does not exist */
app.all('*', (req, res, next) => {
  // Setup the err and send to the custom error handler
  const err = new ExpressError('Route not found', 404);
  next(err); 
});

/** Custom Error handler **/
app.use((err, req, res, next) => {

  if (!err.message) {
    err.message = "Default Error message";
  }

  if (!err.status) {
    err.status = 500;
  }

  // render the error template with the error and error status
  res.status(err.status).render('error', { err });
});