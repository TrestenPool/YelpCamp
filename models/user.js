const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
})

// adds onto the schema
UserSchema.plugin(passportLocalMongoose);

// model
const User = mongoose.model('User', UserSchema);

// export the model
module.exports = User;