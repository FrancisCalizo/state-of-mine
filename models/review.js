const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
var multer = require('multer');

const reviewSchema = new Schema ({
  name        : String,
  city        : String,
  state       : String,
  picturePath : String,
  originalName: String,
  comments    : String,
  rating      : Number
});

const Review = mongoose.model('Review', reviewSchema);

// Make Module Usabale throughtout application
module.exports = Review;