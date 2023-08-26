const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

console.log('Server running at http://127.0.0.1:' + port + '/');

var MongoClient = require('mongodb').MongoClient,fs = require('fs');
var ca = [fs.readFileSync("global-bundle.pem")];
var connection_string = "mongodb://tresten:tresten-password@docdb-2023-08-26-21-17-31.ckpy8z21smjh.us-east-2.docdb.amazonaws.com:27017/?tls=true&tls&retryWrites=false";

MongoClient.connect(
        connection_string, {
            sslValidate: true,
            sslCA: ca,
            useNewUrlParser: true
        },
        function (err,client) {
            console.log(err+" , "+ client);
        })
        .then( (response) => {
          console.log(`connected to mongo`);
        })
        .catch( (error) => {
          console.log(`Error connecting to mongo :( ${error}`);
        })


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