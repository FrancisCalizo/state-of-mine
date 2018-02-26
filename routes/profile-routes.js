const express          = require('express');
const passport         = require('passport');
const profileRouter    = express.Router();
// Middleware to Ensure That User is Logged In or Logged Out
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");
// Require Our Models
const User   = require("../models/user");
const Review = require("../models/review");

// Dashboard Page Only Available if User is Logged In.
// Redirect to Login Page if User is Logged Out
profileRouter.get('/dashboard', ensureLoggedIn(), (req, res, next) => {

  // Review.find((err, review) => {
  //   if (err) {
  //     next(err);
  //     return;
  //   }
  // });

  res.render('profile/dashboard.ejs', { user: req.user })
});

module.exports = profileRouter;