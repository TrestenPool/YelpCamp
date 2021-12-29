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
  await Campground.deleteMany({}); // delete all documents in the campground collection
  // generate the records
  for(let i = 0; i < 50; i++){
    const randNum = Math.floor( Math.random() * 1000 ); // generat the random number

    // generate the random camp site
    const camp = new Campground(
      {
        location: `${cities[randNum].city}, ${cities[randNum].state}`,
        title: `${sample(descriptors)} ${sample(places)}`
      }
    )
    
    // save in the db
    await camp.save();
  }
}

seedDB().then( (response) => {
    mongoose.connection.close();
})