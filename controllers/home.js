/*
 * home.js
 * Custom module for our home controller
 * Corinne Konoza
 * June 10, 2015
 *
 */


// Requirements
var sidebar = require('../helpers/sidebar'),
    ImageModel = require('../models').Image;


// every detail specific to the request that the browser sent
// to the server will be available via the request object
module.exports = {
    index: function(req, res) {


        var viewModel = {
            images: {}
        };

        ImageModel.find({}, {}, {sort: {timestamp: -1}},
        function(err, images) {
            if(err) {throw err;}

            viewModel.images = images;
            sidebar(viewModel, function(viewModel) {
                res.render('index', viewModel);
            });
        });


    }
};
