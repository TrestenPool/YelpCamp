const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const {cloudinary} = require('../cloudinary/index');
const { string } = require('joi');

// https://res.cloudinary.com/udemy-colt-steele-course/image/upload/w_2000,h_2000/v1652224579/YelpCamp/a1ljxnc6mgpgnygisutf

/*** Image Schema ****/
const imageSchema = new mongoose.Schema({
  url: String,
  filename: String
})

// virtual property for images
imageSchema.virtual('thumbnail').get(function() {
  // return this.url.replace('/upload', '/upload/w_500,h_500');
  return this.url.replace('/upload', '/upload/c_fit,w_400,h_400');
})


// Schema for the location point
const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const opts = { toJSON: {virtuals: true}};

/** Campground Schema **/
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

  geometry: {
    type: pointSchema,
    required: true
  },

  // new way
  images: [imageSchema],

  reviews: [
    {
      // refers to the Review Collection
      type: mongoose.Schema.Types.ObjectId, ref: 'Review'
    }
  ],

  author: {
    // refers to the User collection
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
}, opts)

// virtual for the campground popup markup
campgroundSchema.virtual('properties.popUpMarkup').get(function () {
  const popUpMarkup = `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong><p>${this.description.substring(0, 20)}</p>`;
  return popUpMarkup ;
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
              // console.log('RESULTS ===', result, error)
          }
      );

    }    

    
  }




});

// campground model
module.exports = mongoose.model('Campground', campgroundSchema);