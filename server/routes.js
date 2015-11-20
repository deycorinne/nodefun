/*
 * routes.js
 * Custom module for the router
 * Corinne Konoza
 * June 10, 2015
 *
 */


// Requirements
var home = require('../controllers/home'),
    image = require('../controllers/image');


module.exports.initialize = function(app, router) {

    app.get('/', home.index);
    app.get('/images/:image_id', image.index);

    // handle when the browser POSTs a request to the server
    app.post('/images', image.create);
    app.post('/images/:image_id/like', image.like);
    app.post('/images/:image_id/comment', image.comment);

    //** remove to make tests work properly-- app.use('/', router);



    app.delete('/images/:image_id', image.remove);

};