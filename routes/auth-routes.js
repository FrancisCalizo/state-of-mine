const express  = require('express');
const passport = require('passport');
const router   = express.Router();
// Middleware to Ensure That User is Logged In or Logged Out
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");

router.get('/signup', ensureLoggedOut(), (req, res) => {
  res.render('authentication/signup');
});

// Post Request to SignUp, after Passport Set Up
router.post('/signup', ensureLoggedOut(), passport.authenticate('local-signup', {
  successRedirect : '/',
  failureRedirect : '/signup'
}));

router.get('/login', ensureLoggedOut(), (req, res) => {
  res.render('authentication/login')
});

// Post Request to Login, after Passport Set Up
router.post('/login', ensureLoggedOut(), passport.authenticate('local-login', {
  successRedirect : '/',
  failureRedirect : '/login'
}));

// Post Request to Logout the User 
router.post('/logout', ensureLoggedIn('/login'), (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;