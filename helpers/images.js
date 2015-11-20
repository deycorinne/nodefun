/*
 * images.js
 * Responsible for returning various collections of images
 * Corinne Konoza
 * June 12, 2015
 *
 */

var models = require('../models');

module.exports = {
    popular: function(callback) {
        models.Image.find({}, {}, {limit: 9, sort: {likes: -1}},
        function(err,images) {
            if (err) {throw err;}

            callback(null, images);
        });
    }
};