const mongoose = require('mongoose');

/** Schema **/
const campgroundSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
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
  }

})

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;