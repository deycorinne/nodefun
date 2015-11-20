/*
 * sidebar.js
 * Custom module for our sidebar
 * Corinne Konoza
 * June 12, 2015
 *
 */

// Requirements
var Stats = require('./stats'),
    Images = require('./images'),
    Comments = require('./comments')
    async = require('async');

module.exports = function(viewModel, callback) {

    async.parallel([
        function(next){
            Stats(next);
        },
        function(next) {
            Images.popular(callback);
        },
        function(next) {
            Comments.newest(next);
        }
    ], function(err, results){
        viewModel.sidebar = {
            stats: results[0],
            popular: results[1],
            comments: results[2]
        };

        callback(viewModel);

    });

};