const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

console.log('Server running at http://127.0.0.1:' + port + '/');

// /** Configure our app **/
// const {configuration, app} = require('./utils/configuration');
// configuration();

// // get all the routes
// const userRoutes = require('./routes/users');
// const reviewRoutes = require('./routes/review');
// const campgroundRoutes = require('./routes/campground');

// // requires
// const ExpressError = require('./utils/ExpressError');
// const session = require('express-session');

// /**********************************/
// /************** ROUTES ***********/
// /**********************************/

// /** Home route **/
// app.get(['/', '/home'], (req, res, next) => {
//   res.render('home');
// });

// /** Campground routes */
// app.use('/campgrounds', campgroundRoutes);

// /** User routes **/
// app.use('/', userRoutes);

// /** Review routes **/
// app.use('/campgrounds/:id/reviews', reviewRoutes);

// /* 404 route does not exist */
// app.all('*', (req, res, next) => {
//   // Setup the err and send to the custom error handler
//   const err = new ExpressError('Route not found', 404);
//   next(err); 
// });

// /** Custom Error handler **/
// app.use((err, req, res, next) => {

//   if (!err.message) {
//     err.message = "Default Error message";
//   }

//   if (!err.status) {
//     err.status = 500;
//   }

//   // render the error template with the error and error status
//   res.status(err.status).render('error', { err });
// });