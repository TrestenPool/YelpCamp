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
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna. Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa. Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo. ",
        author:  "61e094b4ef4d70be4a6118d6",
        images: [
          `https://res.cloudinary.com/udemy-colt-steele-course/image/upload/v1645212821/YelpCamp/e37edr9prdfwbjyqegxv.png`,
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
