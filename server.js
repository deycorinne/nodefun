/*
 * server.js
 * This is the server for my web application
 * Corinne Konoza
 * June 9, 2015
 *
 */

var express = require('express'),
    config = require('./server/configure'),
    app = express(),
    mongoose = require('mongoose');

app.set('port', process.env.PORT || 3300);
app.set('views', __dirname + '/views');
app = config(app);

mongoose.connect('mongodb://localhost/project1');
mongoose.connection.on('open', function() {
    console.log('Mongoose connected.');
});

// create an HTTP server using app and tell it to
// listen for connections
var server = app.listen(app.get('port'), function() {
    console.log('Server up: http://localhost:' + app.get('port'));
});

