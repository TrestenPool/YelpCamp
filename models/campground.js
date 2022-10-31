const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const {cloudinary} = require('../cloudinary/index');
const { string } = require('joi');

// https://res.cloudinary.com/udemy-colt-steele-course/image/upload/w_2000,h_2000/v1652224579/YelpCamp/a1ljxnc6mgpgnygisutf

const imageSchema = new mongoose.Schema({
  url: String,
  filename: String
})

imageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_500,h_500');
})

/** Schema **/
const campgroundSchema = new mongoose.Schema({
  title: {
    type: String
  },

  price:{
    type: Number
  },

  description:{
    type: String
  },

  location:{
    type: String
  },

  // new way
  images: [imageSchema],

  reviews: [
    {
      // like foreign key
      type: mongoose.Schema.Types.ObjectId, ref: 'Review'
    }
  ],

  author: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }

})

// middleware to be ran when a findOneAndDelete is performed on the campground
// takes care of the extra deletes such as for the reviews of the campground and the images
campgroundSchema.post('findOneAndDelete', async function(doc){

  // do cleanup on the document doc
  if(doc){
    // removes all the reviews that are in the reviews array for the doc
    await Review.remove({
      _id: {
        $in: doc.reviews
      }
    })

    // delete the images from the cloudinary storage
    for(imageSrc of doc.images){
      let file = imageSrc['url'].split('YelpCamp/')[1].split('.')[0];
      let deleteSrc = 'YelpCamp/' + file;
      cloudinary.uploader.destroy(
          deleteSrc,
          {
              invalidate: true
          }, 
          function(error, result) {
              console.log('RESULTS ===', result, error)
          }
      );

    }    

    
  }




});

// campground model
module.exports = mongoose.model('Campground', campgroundSchema);