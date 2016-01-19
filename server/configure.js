var path = require('path');
var routes = require('./routes');
var exphbs = require('express3-handlebars');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var moment = require('moment');
var errorHandler = require('errorhandler');

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

  app.use(morgan('dev'));

  app.use(bodyParser.text({
    uploadDir: path.join(__dirname, '../public/upload/temp')
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());


  routes.initialize(app, new express.Router());
  app.use('/public/', express.static(path.join(__dirname, '../public')));

  if ('development' === app.get('env')) {
    app.use(errorHandler());
  }

  return app;
};
