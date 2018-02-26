const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/stateofmine', {useMongoClient: true});

const Review = require('../models/review');

const reviews = [
  {
    name        : 'La Perrada Del Gordo',
    city        : 'Lake Worth',
    state       : 'Florida',
    picture     : 'Insert Picture Here',
    comments    : 'This place is great!',
    rating      : 10
  }
];

  // Save Fake Review to Database
  Review.create(reviews, (err, docs) => {
    if (err) {
        throw err;
    }

    docs.forEach((review) => {
        console.log(review.name);
    });
    mongoose.connection.close();
  });