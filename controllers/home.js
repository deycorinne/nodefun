/*
 * Corinne Konoza
 * November 20, 2015
 */

var sidebar = require('../helpers/sidebar');
var mongoose = require('mongoose');
var ImageModel = mongoose.model('Image');


// every detail specific to the request that the browser sent
// to the server will be available via the request object
module.exports = {
    index: function (req, res) {


        var viewModel = {
            images: {}
        };

        ImageModel.find({}, {}, {sort: {timestamp: -1}},
            function (err, images) {
                if (err) {
                    throw err;
                }

                viewModel.images = images;
                sidebar(viewModel, function (viewModel) {
                    res.render('index', viewModel);
                });
            });


    }
};
