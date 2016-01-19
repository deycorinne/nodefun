var fs = require('fs');
var path = require('path');
var sidebar = require('../helpers/sidebar');
var Image = require('../models/image');
var Comment = require('../models/comment');

module.exports = {

  index: function(req, res) {
    var viewModel;
    viewModel = {
      image: {},
      comments: []
    };

    Image.findOne({
      filename: {
        $regex: req.params.image_id
      }
    }).exec(function(err, image) {
      if (!image)
        return res.redirect('/');


      image.views = image.views + 1;
      viewModel.image = image;
      image.save();

      Comment.find({
        image_id: image._id
      }).sort({
        'timestamp': 1
      }).exec(function(err, comments) {
        if (err) {
          console.log(err);
          return res.json(500, {
            error: err
          });
        }

        viewModel.comments = comments;

        sidebar(viewModel, function(viewModel) {
          res.render('image', viewModel);
        });
      });
    });

    sidebar(viewModel, function(err, viewModel) {
      res.render('image', viewModel);
    });

  },

  create: function(req, res) {
    console.log(req);

    var saveImage = function() {
      console.log('saveImage was called');
      var possible = 'abcedfghijklmnopqrstuvwxyz0123456789';
      var imgUrl = '';

      for (var i = 0; i < 6; i + 1) {
        imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      console.log(imgUrl);

      Image.find({
        filename: imgUrl
      }).exec(function(err, images) {
        if (images.length > 0) {
          return saveImage();
        }

        var tempPath = req.files.file.path;
        var ext = path.extname(req.files.file.name).toLowerCase();
        var targetPath = path.resolve('./public/upload' + imgUrl + ext);

        var allowed = ['.png', '.jpg', '.jpeg', '.gif'];
        if (allowed.indexOf(ext) > -1) {
          fs.rename(tempPath, targetPath, function(err) {
            if (err) {
              console.log(err);
              return res.json(500, {
                error: err
              });
            }


            var newImg = new Image({
              title: req.body.title,
              filename: imgUrl + ext,
              description: req.body.description
            });
            newImg.save(function(err, image) {
              if (err) {
                console.log(err);
                return res.json(500, {
                  error: err
                });
              }
              console.log('image saved!');
            });
          });

        } else {
          fs.unlink(tempPath, function() {
            if (err) {
              console.log(err);
              return res.json(500, {
                error: err
              });
            }

            res.json(500, {
              error: 'Only image files are allowed.'
            });
          });
        }
      });
    };

    saveImage();
  },


  like: function(req, res) {

    Image.findOne({
      filename: {
        $regex: req.params.image_id
      }
    }).exec(function(err, image) {
      if (err || !image) {
        console.log(err);
        return res.json(500, {
          error: 'There was a problem liking this image.'
        });
      }


      image.likes = image.likes + 1;
      image.save(function(err) {
        if (err) {
          console.log(err);
          return res.json(500, {
            error: err
          });
        }
        res.json({
          likes: image.likes
        });
      });
    });
  },


  comment: function(req, res) {

    Image.findOne({
      filename: {
        $regex: req.params.image_id
      }
    }).exec(function(err, image) {
      if (err || !image) {
        console.log(err);
        return res.json(500, {
          error: 'There was a problem commenting on this image.'
        });
      }

      var newComment = new Models.Comment(req.body);
      newComment.gravatar = md5(newComment.email);
      newComment.image_id = image._id;
      newComment.save(function(err, comment) {
        if (err) {
          console.log(err);
          return res.json(500, {
            error: "Problem saving your comment"
          });
        }
        res.redirect('/images/' + image.uniqueId + '#' + comment._id);
      });
    });
  },


  remove: function(req, res) {

    Image.findOne({
      filename: {
        $regex: req.params.image_id
      }
    }).exec(function(err, image) {
      if (err) {
        console.log(err);
        return res.json(500, {
          error: 'Problem looking for image'
        });
      }

      fs.unlink(path.resolve('./public/upload/' + image.filename),
        function(err) {
          if (err) {
            console.log(err);
            return res.json(500, {
              error: 'Problem removing image'
            });
          }

          Comment.remove({
            image_id: image._id
          }).exec(function(err) {
            image.remove(function(err) {
              if (!err) {
                res.json(true);
              } else {
                res.json(false);
              }
            });
          });
        });
    });
  }
};
