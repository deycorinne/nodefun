var Image = require('../models/image');
var Comment = require('../models/comment');
var async = require('async');

module.exports = function(callback) {
  async.parallel([
    function(next) {
      Image.count({}, next);
    },
    function(next) {
      Comment.count({}, next);
    },
    function(next) {
      Image.aggregate({
        $group: {
          _id: '1',
          viewsTotal: {
            $sum: '$views'
          }
        }
      }).exec(function(err, result) {
        var viewsTotal = 0;
        if (result.length > 0) {
          viewsTotal += result[0].viewsTotal;
        }
        next(null, viewsTotal);
      });
    },
    function(next) {
      Image.aggregate({
        $group: {
          _id: '1',
          likesTotal: {
            $sum: '$likes'
          }
        }
      }, function(err, result) {
        var likesTotal = 0;
        if (result.length > 0) {
          likesTotal += result[0].likesTotal;
        }
        next(null, likesTotal);
      });
    }
  ], function(err, results) {
    callback(null, {
      images: results[0],
      comments: results[1],
      views: results[2],
      likes: results[3]
    });
  });
};
