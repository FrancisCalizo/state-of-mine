const express  = require('express');
const passport = require('passport');
const router   = express.Router();
// Middleware to Ensure That User is Logged In or Logged Out
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
// Require the User Model
const User   = require("../models/user");

// Route to Display Signup Form
router.get('/signup', ensureLoggedOut(), (req, res) => {
  res.render('authentication/signup');
});

// Route to Handle Signup Form Submission
router.post("/signup", ensureLoggedOut(), (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check for whether user has provided username and password
  if (username === "" || password === "") {
      res.render("authentication/signup", { message: "Indicate username and password" });
      return;
  }

  User.findOne({ username }, "username", (err, user) => {
      
      // Check whether User already exists in the database
      if (user != null) {
          res.render("authentication/signup", { message: "The username already exists" });
          return;
      }

      // Encrypt password
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      // Generate new User with encrypted password
      const newUser = new User({
          username,
          password: hashPass
      });

      // Save the new User to the database
      newUser.save((err) => {
          if (err) {
              res.render("authentication/signup", { message: "Something went wrong" });
          } else {
              res.redirect("/");
          }
      });
  });
});

// Route to Display Login Form
router.get('/login', ensureLoggedOut(), (req, res) => {
  res.render('authentication/login', { 
    // Render the Error on Login Page
    'message': req.flash('error') });
});

// Post Request to Login, after Passport Set Up
router.post('/login', ensureLoggedOut(), passport.authenticate('local', {
  successRedirect : '/dashboard',
  failureRedirect : '/login',
  failureFlash: true,
  passReqToCallback: true
}));

// Post Request to Logout the User 
router.post('/logout', ensureLoggedIn('/login'), (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;