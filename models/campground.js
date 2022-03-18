const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const {cloudinary} = require('../cloudinary/index')


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

  // array of images
  images: [
    {
      type: String
    }
  ],

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'Review'
    }
  ],

  author: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }

})

// post middleware to remove all reviews from the review collection that are in the reviews array for the campground
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
      let file = imageSrc.split('YelpCamp/')[1].split('.')[0];
      let deleteSrc = 'YelpCamp/' + file;
      cloudinary.uploader.destroy(
          deleteSrc,
          {
              invalidate: true
          }, 
          function(error, result) {
              // console.log('RESULTS ===', result, error)
          }
      );

    }    

    
  }




});

// campground model
module.exports = mongoose.model('Campground', campgroundSchema);