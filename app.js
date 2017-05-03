var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//non default packages
var mongoose = require('mongoose');
var cors = require('cors');
var passport = require('passport');

//database
var configDb = require('./config/database');
mongoose.connect(configDb.url);

//use cors
var app = express();
require('./models/_index')(); //load all the models

//app config
require('./config/handlebars')(app);
require('./config/passport')(passport);
app.use(cors());
app.use(passport.initialize());
app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//make broadcast easy accesiable
app.use(function(req, res, next){ 
  req.broadcast = app.get('broadcast'); 
  next(); 
});

require('./routes/_index')(app); //load all the routes

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
