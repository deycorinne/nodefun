var sidebar = require('../helpers/sidebar');
var ImageModel = require('../models/image');

module.exports = {
  index: function(req, res) {
    var viewModel = {
      images: {}
    };

    ImageModel.find({}).sort({timestamp: -1}).exec(function(err, images) {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      viewModel.images = images;

      sidebar(viewModel, function(viewModel) {
        res.render('index', viewModel);
      });
    });
  }
};
