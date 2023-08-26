const express = require('express');
const app = express();

const port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('index.html');

const log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

const server = http.createServer(function (req, res) {
    if (req.method === 'POST') {
        let body = '';

        req.on('data', function(chunk) {
            body += chunk;
        });

        req.on('end', function() {
            if (req.url === '/') {
                log('Received message: ' + body);
            } else if (req.url = '/scheduled') {
                log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
            }

            res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
            res.end();
        });
    } else {
        res.writeHead(200);
        res.write(html);
        res.end();
    }
});

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
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