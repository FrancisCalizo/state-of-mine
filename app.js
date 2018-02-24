const express         = require('express');
const path            = require('path');
const favicon         = require('serve-favicon');
const logger          = require('morgan');
const cookieParser    = require('cookie-parser');
const bodyParser      = require('body-parser');
// Added Requirements after Express Generator
const mongoose        = require('mongoose');
const bcrypt          = require('bcrypt');
const expressLayouts  = require('express-ejs-layouts');

// Connect Mongoose to the 'stateofmine' Database
mongoose.connect('mongodb://localhost/stateofmine');

const app = express();

// Views Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Setup Express Layouts 
app.set('layout', 'layouts/main-layout');
app.use(expressLayouts);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Define the Routes for Middleware
const index = require('./routes/index');
const users = require('./routes/users');
// Middleware Routes
app.use('/', index);
app.use('/users', users);

// Check to See if User is Signed In // 
// CLARIFY WHAT THIS CODE DOES !!! MAY DELETE THIS!
app.use( (req, res, next) => {
  if (typeof(req.user) !== "undefined"){
    res.locals.userSignedIn = true;
  } else {
    res.locals.userSignedIn = false;
  }
  next();
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
