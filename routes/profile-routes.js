const express          = require('express');
const passport         = require('passport');
// Require for File Upload
const multer           = require('multer');
const profileRouter    = express.Router();

// Middleware to Ensure That User is Logged In or Logged Out
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");
// Require Our Models
const User   = require("../models/user");
const Review = require("../models/review");
// Points File Upload into Destination Folder
const upload = multer({ dest: './public/uploads/' });


// Dashboard Page Only Available if User is Logged In.
// Redirect to Login Page if User is Logged Out
profileRouter.get('/dashboard', ensureLoggedIn(), (req, res, next) => {
  Review.find({}, (err, reviews) => {
    if (err) {return next(err) }
    // Render Dashboard with user Reviews
    res.render('profile/dashboard.ejs', { 
      user   : req.user,
      reviews: reviews
    });
  });
});

// Route Handler for New Review to Dashboard
profileRouter.get('/new', ensureLoggedIn(), (req, res, next) => {
  res.render('profile/new');
});

// Route Handler for Creating new Review 
profileRouter.post('/dashboard', upload.single('file-to-upload'), (req, res, next) => {
  // Take the params and translate them into a new object
  const reviewInfo = {
      name        : req.body.name,
      city        : req.body.city,
      state       : req.body.state,
      // req.file path from Multer
      picturePath : `/uploads/${req.file.filename}`,
      originalName: req.file.originalName,
      comments    : req.body.comments,
      rating      : req.body.rating
  }

  // Create a newReview with the Params passed
  // in from the "/new" form
  const newReview = new Review(reviewInfo);

  newReview.save( (err) => {
      // Error Handling
      if (err) { return next(err) }

      // Redirect to the Dashboard if it Saves
      return res.redirect('/dashboard');
  });
});

// Show form to Update Review
profileRouter.get('/:id/edit-review', (req, res, next) => {
  const reviewId = req.params.id;
  // Search DB by Review ID
  Review.findById(reviewId, (err, review) => {
      if (err) { return next(err); }
      // Render Review Details to Edit
      res.render('profile/edit-review', { review: review });
  });
});

// Update Product Information to Database 
profileRouter.post('/:id/edit-review', (req, res, next) => {
  const reviewId = req.params.id;

  // Create a New Object with All the Information From the Req Body.
  const updateReview = {
    name: req.body.name,
    city: req.body.city,
    state: req.body.state,
    picture: req.body.picture,
    comments: req.body.comments,
    rating: req.body.rating
  };
  // Take the Params above and Update into the Database
  Review.findByIdAndUpdate(reviewId, updateReview, (err, review) => {
    if (err){ return next(err); }
    // Redirect to the Dashboard if Successful
    return res.redirect('/dashboard');
  });
});

// Delete Product from Database
profileRouter.post('/:id/delete', (req, res, next) => {
  const reviewId = req.params.id;
  // Use Find to Locate & Remove 
  Review.findByIdAndRemove(reviewId, (err, product) => {
    if (err){ return next(err); }
    return res.redirect('/dashboard');
  });
});

module.exports = profileRouter;