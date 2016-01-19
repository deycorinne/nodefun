var Image = require('../models/image');

module.exports = {
  popular: function(callback) {
    Image.find({}).limit(9).sort({
      likes: -1
    }).exec(function(err, images) {
      if (err) {
        throw err;
      }
      callback(null, images);
    });
  }
};
