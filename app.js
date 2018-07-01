var express = require('express');
var app = express();
var db = require('./db');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    next();
  });

var AuthController = require('./controllers/AuthController');
app.use('/api/auth', AuthController);

var UserController = require('./controllers/UserController');
app.use('/api/users', UserController);

var RecordController = require('./controllers/RecordController');
app.use('/api/records', RecordController);

module.exports = app;