const  mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Campground = require('./campground');

// review schema
const reviewSchema = new Schema({
  body: {
    type: String
  },
  rating: {
    type: Number
  },
  author: {
    type: Schema.Types.ObjectId, ref: 'User'
  }
})

module.exports =  mongoose.model('Review', reviewSchema);
