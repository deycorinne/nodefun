/*
 * Corinne Konoza
 * November 20, 2015
 */

var sidebar = require('../helpers/sidebar');
var mongoose = require('mongoose');
var ImageModel = mongoose.model('Image');

module.exports = {
    index: function (req, res) {

        var viewModel = {
            images: {}
        };

        ImageModel.find({}).sort({timestamp: -1}).exec(function (err, images) {
            if (err) {
                console.log(err);
            }

            viewModel.images = images;

            sidebar(viewModel, function (viewModel) {
                res.render('index', viewModel);
            });
        });
    }
};
