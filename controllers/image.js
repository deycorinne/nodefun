/*
 * Corinne Konoza
 * November 20, 2015
 */


// Requirements
var fs = require('fs'),
    path = require('path'),
    sidebar = require('../helpers/sidebar'),
    Models = require('../models');

module.exports = {

    index: function (req, res) {

        // declare our empty viewModel variable object
        var viewModel;
        viewModel = {
            image: {},
            comments: []
        };

        // find the image by searching the filename matching the url
        Models.Image.findOne({filename: {$regex: req.params.image_id}},

            function (err, image) {
                if (image) {
                    // if the image was found, inc views
                    image.views = image.views + 1;
                    // save the image object to the viewModel
                    viewModel.image = image;
                    // save the model after updating
                    image.save();

                    // find any comments with matching image_id
                    Models.Comment.find({image_id: image._id}, {}, {sort: {'timestamp': 1}},
                        function (err, comments) {
                            if (err) {
                                throw err;
                            }

                            // save the comments collection to the viewModel
                            viewModel.comments = comments;

                            // build the sidebar sending along the viewModel
                            sidebar(viewModel, function (viewModel) {
                                res.render('image', viewModel);
                            });
                        }
                    );

                } else {
                    // if no image was found, return to homepage
                    res.redirect('/');
                }
            });

        sidebar(viewModel, function (err, viewModel) {
            res.render('image', viewModel);
        });

    },

    create: function (req, res) {

        // save image fn creates random ID
        var saveImage = function () {

            var possible = 'abcedfghijklmnopqrstuvwxyz0123456789',
                imgUrl = '';

            for (var i = 0; i < 6; i + 1) {
                imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            // search for an image with the same filename by using find
            Models.Image.find({filename: imgUrl}, function (err, images) {
                if (images.length > 0) {
                    // if a matching image is found, start over
                    saveImage();
                } else {

                    var tempPath = req.files.file.path,
                        ext = path.extname(req.files.file.name).toLowerCase(),
                        targetPath = path.resolve('./public/upload' + imgUrl + ext);

                    // check to make sure file is an image, if not send error msg
                    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                        fs.rename(tempPath, targetPath, function (err) {
                            if (err) {
                                throw err;
                            }

                            // create new Image model
                            var newImg = new Models.Image({
                                title: req.body.title,
                                filename: imgUrl + ext,
                                description: req.body.description
                            });
                        });

                    } else {
                        fs.unlink(tempPath, function () {
                            if (err) {
                                throw err;
                            }

                            res.json(500, {error: 'Only image files are allowed.'});
                        });
                    }
                }
            });

        };

        saveImage();
    },


    like: function (req, res) {

        Models.Image.findOne({filename: {$regex: req.params.image_id}},
            function (err, image) {
                if (!err && image) {
                    image.likes = image.likes + 1;
                    image.save(function (err) {
                        if (err) {
                            res.json(err);
                        } else {
                            res.json({likes: image.likes});
                        }
                    });
                }
            });
    },


    comment: function (req, res) {

        Models.Image.findOne({filename: {$regex: req.params.image_id}},
            function (err, image) {
                if (!err && image) {
                    var newComment = new Models.Comment(req.body);
                    newComment.gravatar = md5(newComment.email);
                    newComment.image_id = image._id;
                    newComment.save(function (err, comment) {
                        if (err) {
                            throw err;
                        }
                        res.redirect('/images/' + image.uniqueId + '#' + comment._id);
                    });
                } else {
                    res.redirect('/');
                }
            });
    },


    remove: function (req, res) {

        Models.Image.findOne({filename: {$regex: req.params.image_id}},
            function (err, image) {
                if (err) {
                    throw err;
                }

                fs.unlink(path.resolve('./public/upload/' + image.filename),
                    function (err) {
                        if (err) {
                            throw err;
                        }

                        Models.Comment.remove({image_id: image._id},
                            function (err) {
                                image.remove(function (err) {
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
