const mongoose = require('mongoose');

/** Schema **/
const campgroundSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  price:{
    type: String
  },

  description:{
    type: String
  },

  location:{
    type: String
  }
})

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;