var Comment = require('../models/comment');
var Image = require('../models/comment');
var async = require('async');

module.exports = {

  newest: function(callback) {

    Comment.find({}).limit(5).sort({
      'timestamp': -1
    }).exec(function(err, comments) {
      var attachImage = function(comment, next) {
        Image.findOne({
          _id: comment.image_id
        }).exec(function(err, image) {
          if (err) {
            throw err;
          }
          comment.image = image;
          next(err);
        });
      };

      async.each(comments, attachImage,
        function(err) {
          if (err) {
            throw err;
          }
          callback(err, comments);
        });
    });
  }
};
