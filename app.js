'use strict';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongojs = require('mongojs');
var multer = require('multer');

var webRoutes = require(path.join(__dirname, 'routes', 'web'));
var apiRoutes = require(path.join(__dirname, 'routes', 'api'));
var inputRoutes = require(path.join(__dirname, 'routes', 'input'));

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({
    dest: './public/images',
    rename: function (fieldname, filename) {
        return filename.replace(/\s+/g, "-").toLowerCase();
    },
    limits: {
        files: 1
    }
}));

var mongoURI = process.env.MONGO_LAB_URI || 'mongodb://localhost/handbook';
var db = mongojs(mongoURI);

app.use(function (request, response, next) {
    request.db = db;
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
