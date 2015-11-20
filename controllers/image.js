/*
 * Corinne Konoza
 * November 20, 2015
 */

var fs = require('fs');
var path = require('path');
var sidebar = require('../helpers/sidebar');
var Models = require('../models');

module.exports = {

    index: function (req, res) {
        var viewModel;
        viewModel = {
            image: {},
            comments: []
        };

        Models.Image.findOne({filename: {$regex: req.params.image_id}}).exec(function (err, image) {
            if (image) {
                image.views = image.views + 1;
                viewModel.image = image;
                image.save(function (err, image) {
                    if (err) {
                        console.log(err);
                    }
                });

                Models.Comment.find({image_id: image._id}).sort({'timestamp': 1}).exec(function (err, comments) {
                        if (err) {
                            throw err;
                        }

                        viewModel.comments = comments;
                        sidebar(viewModel, function (viewModel) {
                            res.render('image', viewModel);
                        });
                    }
                );

            } else {
                res.redirect('/');
            }
        });

        sidebar(viewModel, function (err, viewModel) {
            res.render('image', viewModel);
        });

    },

    create: function (req, res) {
        var possible = 'abcedfghijklmnopqrstuvwxyz0123456789';
        var imgUrl = '';

        for (var i = 0; i < 6; i + 1) {
            imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        Models.Image.find({filename: imgUrl}).exec(function (err, images) {
            if (images.length > 0) {
                saveImage();
            } else {

                var tempPath = req.files.file.path;
                var ext = path.extname(req.files.file.name).toLowerCase();
                var targetPath = path.resolve('./public/upload' + imgUrl + ext);

                if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                    fs.rename(tempPath, targetPath, function (err) {
                        if (err) {
                            throw err;
                        }

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
    },


    like: function (req, res) {
        Models.Image.findOne({filename: {$regex: req.params.image_id}}).exec(function (err, image) {
            if (err) {
                console.log(err);
                res.json(err);
            }

            image.likes = image.likes + 1;
            image.save(function (err, image) {
                if (err) {
                    res.json(err);
                }
                res.json({likes: image.likes});
            });
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