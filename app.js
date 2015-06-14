'use strict';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoClient = require('mongodb').MongoClient;

var webRoutes = require(path.join(__dirname, 'routes', 'web'));
var apiRoutes = require(path.join(__dirname, 'routes', 'api'));
var inputRoutes = require(path.join(__dirname, 'routes', 'input'));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var mongoURI = process.env.MONGO_LAB_URI || 'mongodb://localhost/handbook';
var mongodbOptions = {
    db: {
        native_parser: true,
        recordQueryStats: true,
        retryMiliSeconds: 500,
        numberOfRetries: 10
    },
    server: {
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS: 10000
        },
        auto_reconnect: true,
        poolSize: 50
    }
};
var mongo;
var onConnect = function (err, db) {
  if(err)
  {
    console.log("unable to connect to mongodb error :" + err);
  }
  else {
    mongo = db;
  }
};

mongoClient.connect(mongoURI, mongodbOptions, onConnect);
app.use(function (request, response, next) {
    request.db = mongo;
    next();
});
app.use('/', webRoutes);
app.use('/api', apiRoutes);
app.use('/input', inputRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
