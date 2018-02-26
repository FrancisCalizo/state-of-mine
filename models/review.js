const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const reviewSchema = new Schema ({
  name        : String,
  city        : String,
  state       : String,
  picture     : String, // Look up Multer 
  comments    : String,
  rating      : Number
});

const Review = mongoose.model('Review', reviewSchema);

// Make Module Usabale throughtout application
module.exports = Review;