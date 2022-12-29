const mongoose = require('mongoose');
const Campground = require('../models/campground');
const Review = require('../models/review');

// used for generating the random values
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

require('dotenv').config();

// mapbox 
const mbxClient = require('@mapbox/mapbox-sdk');
const mabBoxToken = process.env.MAPBOX_TOKEN;
const baseClient = mbxClient({ accessToken: mabBoxToken });
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding(baseClient);

// connect to mongodb
mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser:true, useUnifiedTopology: true})
  .then( () => {
    console.log(`Connected to mongodb`);
  })
  .catch( (err) => {
    console.log(`MongoDB Error connecting to mongodb`);
    console.log(`${err}`);
  });

// Creates an arrow function called sample that takes in an array and returns a random element within it
const sample = (array) => array[Math.floor( Math.random() * array.length )];

// function to seed the db
const seedDB = async () => {

  // delete all the campgrounds in the campground collection
  await Campground.deleteMany({})

  // delete all the reviews in the reviews collection
  await Review.deleteMany({})

  // generate the records
  for(let i = 0; i < 100; i++){
    const randNum = Math.floor( Math.random() * 1000 ); // generat the random number

    const locationGenerated =  `${cities[randNum].city}, ${cities[randNum].state}`;

    const geoData = await geocoder.forwardGeocode(
      {
        query: locationGenerated,
        limit: 1
      }
    ).send()

    geometry_generated = geoData.body.features[0].geometry;

    // generate the random camp site
    const camp = new Campground(
      {
        location: locationGenerated,
        geometry : geometry_generated,
        title: `${sample(descriptors)} ${sample(places)}`,
        price: 10,    
        description: "Description goes here...",
        author:  "61e094b4ef4d70be4a6118d6",

        images: [
          {
          url : "https://res.cloudinary.com/udemy-colt-steele-course/image/upload/v1667836280/YelpCamp/cabin_pqtdty.jpg",
          filename: "cabin.jpg"
          }
        ]

      }
    ) 
   
    // save in the db
    await camp.save();
  }
}

// run our seeding function, then close the file
seedDB().then( (response) => {
    mongoose.connection.close();
})