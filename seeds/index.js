const mongoose = require('mongoose');
const Campground = require('../models/campground');

// used for generating the random values
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

// connect to mongodb
mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser:true, useUnifiedTopology: true})
  .then( () => {
    console.log(`Connected to mongodb`);
  })
  .catch( (err) => {
    console.log(`MongoDB Error connecting to mongodb`);
    console.log(`${err}`);
  });

// generates random sample data for th
const sample = array => array[Math.floor( Math.random() * array.length )];

// function to seed the db
const seedDB = async () => {

  // delete all documents in the campground collection
  await Campground.deleteMany({}); 

  // generate the records
  for(let i = 0; i < 50; i++){
    const randNum = Math.floor( Math.random() * 1000 ); // generat the random number

    // generate the random camp site
    const camp = new Campground(
      {
        location: `${cities[randNum].city}, ${cities[randNum].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        price: 10,    
        description: "Description goes here...",
        author:  "61e094b4ef4d70be4a6118d6",

        images: [
          {
          url : "https://res.cloudinary.com/udemy-colt-steele-course/image/upload/v1667232050/YelpCamp/cabin_gdmouc.jpg",
          filename: "cabin.jpg"
          }
        ]

      }
    ) 
   
    // save in the db
    await camp.save();
  }
}

seedDB().then( (response) => {
    mongoose.connection.close();
})
