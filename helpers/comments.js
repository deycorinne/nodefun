/*
 * images.js
 * Responsible for returning newest comments on the site
 * each comment has an image attached as a thumbnail
 * Corinne Konoza
 * June 12, 2015
 *
 */

var models = require('../models'),
    async = require('async');

module.exports = {

    newest: function(callback){

        models.Comment.find({}, {}, {limit: 5, sort: {'timestamp': -1}},
        function(err, comments){

            // attach an image to each comment
            var attachImage = function(comment, next) {
                models.Image.findOne({ _id: comment.image_id},
                function(err, image){
                    if(err) {throw err;}
                    comment.image = image;
                    next(err);
                });
            };

            async.each(comments, attachImage,
            function(err) {
                if (err) {throw err;}
                callback(err, comments);
            });

        })
    }
};

