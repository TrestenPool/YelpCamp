const mongoose = require('mongoose');
const Review = require('./review');

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

  image:{
    type: String
  },

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
  // a campground was successfully deleted and returned to us a query
  if(doc){
    // removes all the reviews that are in the reviews array for the doc
    await Review.remove({
      _id: {
        $in: doc.reviews
      }
    })
  }
})

// campground model
module.exports = mongoose.model('Campground', campgroundSchema);