/*
 * configure.js
 * Custom module called 'configure'
 * Corinne Konoza
 * June 9, 2015
 *
 */

// Requirements
var path = require('path'),
    routes = require('./routes'),
    exphbs = require('express3-handlebars'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    moment = require('moment'),
    errorHandler = require('errorhandler');

module.exports = function(app) {

    path.join(__dirname, 'path/to/file');

    app.engine('handlebars', exphbs.create({
        defaultLayout: 'main',
        layoutsDir: app.get('views') + '/layouts',
        partialsDir: [app.get('views') + '/partials'],
        helpers: {
            timeago: function(timestamp) {
                return moment(timestamp).startOf('minute').fromNow();
            }
        }
    }).engine);
    app.set('view engine', 'handlebars');

    // logger: performs a console.log() of any request received by the server
    app.use(morgan('dev'));

    // bodyParser: parse an HTML body into a string (POST)
    app.use(bodyParser.text({
        uploadDir:path.join(__dirname, '../public/upload/temp')
    }));
    app.use(bodyParser.json({extended: true}));
    app.use(bodyParser.urlencoded({extended: true}));

    // methodOverride: for older browsers that don't properly support
    // REST HTTP verbs
    app.use(methodOverride());

    // cookieParser: allows cookies to be sent/received
    app.use(cookieParser('some-secret-value-here'));

    routes.initialize(app, new express.Router());

    // static: used to render static content files to the browser
    // from a predefined static resource library
    app.use('/public/', express.static(path.join(__dirname, '../public')));

    // errorHandler: handles any errors that occur throughout the entire
    // middleware process
    if ('development' === app.get('env')) {
        app.use(errorHandler());
    }

    return app;
};
