const express         = require('express');
const path            = require('path');
const favicon         = require('serve-favicon');
const logger          = require('morgan');
const cookieParser    = require('cookie-parser');
const bodyParser      = require('body-parser');
// Added Requirements after Express Generator
const mongoose        = require('mongoose');                // CRUD MongoDB in JS File
const bcrypt          = require('bcrypt');                  // Password Encryption
const expressLayouts  = require('express-ejs-layouts');     // Templates (Partials)
const passport        = require('passport');                // Authentication Middleware
const session         = require('express-session');         // Stores User Sessions
const LocalStrategy   = require('passport-local').Strategy  // Local Strategy for PP
const MongoStore      = require('connect-mongo')(session);  // Store Sessions in DB

const User            = require('./models/user');

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

// Initialize a Session and Passport
app.use(session({
  secret: 'State of Mind',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore( { mongooseConnection: mongoose.connection })
}));

// COMMENT ON FUNCTIONALITY 
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});
// COMMENT ON FUNCTIONALITY 
passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// Passport Strategy for Signing Up
passport.use('local-signup', new LocalStrategy(
  { passReqToCallback: true },
  (req, username, password, next) => {
    // To avoid race conditions
    process.nextTick(() => {
        User.findOne({
            'username': username
        }, (err, user) => {
            if (err){ return next(err); }

            if (user) {
                return next(null, false);
            } else {
                // Destructure the body // IS EMAIL & DESCRIPTION NEEDED?
                const { username, password } = req.body;
                const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                const newUser = new User({
                  username,
                  password: hashPass
                });
                // COMMENT ON FUNCTIONALITY
                newUser.save((err) => {
                    if (err){ next(err); }
                    return next(null, newUser);
                });
            }
        });
    });
}));

// Passport Stategy for Logging In
passport.use('local-login', new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));


app.use(passport.initialize());
app.use(passport.session());

// Define the Routes for Middleware
const index = require('./routes/index');
const authRoutes = require('./routes/auth-routes.js');

// Middleware Routes
app.use('/', index);
app.use('/', authRoutes);

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
