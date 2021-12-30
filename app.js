const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const method = require('method-override');
const ejsMate = require('ejs-mate');

// connection to the mongodb
mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser:true})
  .then( () => {
    console.log(`Connected to mongodb`);
  })
  .catch( (err) => {
    console.log(`MongoDB Error connecting to mongodb`);
    console.log(`${err}`);
  });


// port listening on 
const portNumber = 3000;
app.listen(portNumber, () => {
  console.log(`Listening on port ${portNumber}`);
})

/** Middleware **/
// view engine to ejs
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
// used to parse request body
app.use(express.urlencoded());
// used for sending different methods in html form
app.use(method('_method'));
app.engine('ejs', ejsMate);

const verifyPassword = (req, res, next) => {
  const {password} = req.query;
  if(password === 'Treste is super cool'){
    return next();
  }
  else{
    res.send('Incorrect password');
  }
}

/**********************************/
/************** ROUTES ***********/
/**********************************/
// model we will be manipulating in the mongo db
const Campground = require('./models/campground');

/** HOME PAGE **/
app.get('/', (req, res) => {
  res.render('campgrounds/home')
})

/*** INDEX PAGE ***/
app.get('/campgrounds', async (req,res) => {
  // get all the campgrounds, sorts by title
  const campgrounds = await Campground.find({}).sort({title: "ascending"});

  // render the list view
  res.render('campgrounds/index', {campgrounds});
})


/*** FORM TO CREATE A NEW CAMPGROUND ***/
app.get('/campgrounds/new', (req,res) => {
  res.render('campgrounds/new');
});


/*** POST REQUEST TO INSERT NEW CAMPGROUND ***/
app.post('/campgrounds', async (req,res) => {
  const campground = new Campground(req.body.campground);
  await campground.save()
  .then(msg => {
    // redirect to the show route
    res.redirect(`/campgrounds/${campground._id}`);
  })
  .catch(err => {
    console.log(`Encountered an ERROR: ${err}`);
  });

})

/*** FORM TO EDIT A CAMPGROUND ***/
app.get('/campgrounds/:id/edit', async (req,res) => {
  const {id} = req.params;  

  // get the object in the db by id
  await Campground.findById({_id: id}) 
    .then( (response) => {
      const camp = response;
      res.render('campgrounds/edit', {camp} )
    })
    // error, go back to the show page for the campground
    .catch( (error) => {
      console.log(`Unable to find id:${id} ${error}`);
      res.redirect('/campgrounds');
    })
})

/*** PATCH REQUEST TO EDIT A CAMPGROUND ***/
app.patch('/campgrounds/:id/edit', async (req,res) => { 
  const {id} = req.params;

  /** delete from the request body if it is empty **/
  // if(req.body.campground.title.length == 0){
  //   delete req.body.campground["title"];
  // }
  // if(req.body.campground.location.length == 0){
  //   delete req.body.campground["location"];
  // }

  // update the campground
  await Campground.findByIdAndUpdate({_id: id}, {...req.body.campground} , {runValidators: true, returnOriginal: false})
    .then( (response) => {
      const camp = response;
      console.log(`Successfully updated: ${response}`);
      // redirect back to its show page
      res.redirect(`/campgrounds/${camp._id}`);
    })
    .catch( (error) => {
      console.log(`Error updating... ${error}`);
      // redirect back to the index page
      res.redirect('/campgrounds');
    })

})


/*** DELETE CAMP ***/
app.delete('/campgrounds/:id', async (req,res) => {
  const {id} = req.params;
  let camp = null;

  // attempts to delete by the id
  camp = await Campground.findByIdAndDelete({_id: id})
    .then( (response) => {
      // the id was not found in the db
      if(response === null){
        console.log(`The ID:${id} was not found`);
      }
      // the id was found and delted
      else{
        console.log(`Success, deleted ${response}`);
      }
    })
    .catch( (error) => {
      console.log(`Error deleting ID:${id} ${error}`);
    })

    // redirect to the index page
    res.redirect('/campgrounds');
})

/*** SHOW PAGE ***/
app.get('/campgrounds/:id', async (req,res) => {
  const {id} = req.params; 

  // look for the id in the db
  await Campground.findById({_id: id})
  .then( (response) => {
    const camp = response;
    res.render('campgrounds/show', {camp});
  })
  .catch( (error) => {
    console.log(`Error: ${error}`);
    console.log('Redirecting to home page');
    res.redirect('/campgrounds');
  })
});


/** 404 **/
app.use( (req, res, next) => {
  res.status(404).send("404, route not found");
})