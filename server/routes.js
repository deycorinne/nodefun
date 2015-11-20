/*
 * Corinne Konoza
 * November 20, 2015
 */


// Requirements
var home = require('../controllers/home');
var image = require('../controllers/image');


module.exports.initialize = function (app, router) {

    app.get('/', home.index);

    app.get('/images/:image_id', image.index);
    app.post('/images', image.create);
    app.post('/images/:image_id/like', image.like);
    app.post('/images/:image_id/comment', image.comment);
    app.delete('/images/:image_id', image.remove);

    //** remove to make tests work properly-- app.use('/', router);
};