/*
 * image.js
 * This a comment model for my web application
 * Corinne Konoza
 * June 15, 2015
 *
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var CommentSchema = new Schema({
    image_id: {type: ObjectId},
    email: {type: String},
    name: {type: String},
    gravatar: {type: String},
    comment: {type: String},
    timestamp: {type: Date, 'default': Date.now}
});

CommentSchema.virtual('image').set(function(image){
    this.image = image;
}).get(function(){
    return this._image;
});

module.exports = mongoose.model('Comment', CommentSchema);


