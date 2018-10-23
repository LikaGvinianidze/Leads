'use strict';

const express      = require('express');
const path         = require('path');
const logger       = require('morgan');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const session      = require('express-session');
const passport     = require('passport');
const flash        = require('connect-flash');

// Initialize passport configuration
require('./config/passport')(passport);

const config = require('./config/config');

// Loading routes
const routes = require('./routes/index');

// Load middlewares
const {isLoggedIn} = require('./middlewares/auth');
const {isAdmin} = require('./middlewares/admin');
const {role} = require('./middlewares/role');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*
  Middlewares
*/

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
  secret: config.secret,
  resave: true,
  saveUninitialized: true
} ));

// Passport initialize
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/*
  Routes
*/

app.use(routes.auth);
app.use(isLoggedIn, role, routes.home);
app.use(isLoggedIn, routes.services);
app.use(isLoggedIn, routes.personnel);
app.use(isLoggedIn, routes.clients);
app.use(isLoggedIn, routes.bookings);
app.use(isLoggedIn, routes.reports);
app.use(isLoggedIn, routes.profile);

// Admin routes
app.use(isLoggedIn, isAdmin, routes.users);
app.use(isLoggedIn, isAdmin, routes.roles);
app.use(isLoggedIn, isAdmin, routes.permissions);
app.use(isLoggedIn, isAdmin, routes.organizations);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('snippets/pages/errors/error');
});

// Start the server
const port = config.server.port;

app.listen(port);
console.log(`Server listening at ${port}`);
