var home = require('../controllers/home');
var image = require('../controllers/image');
var multer = require('multer');


var upload = multer({
  dest: '../uploads/',
  limits: {
    fieldNameSize: 1024 * 1024 * 1000 // 1GB
  }
});

module.exports.initialize = function(app, router) {

  app.get('/', home.index);
  app.get('/images/:image_id', image.index);

  app.post('/images', upload.single('file'), image.create);
  app.post('/images/:image_id/like', image.like);
  app.post('/images/:image_id/comment', image.comment);
  app.delete('/images/:image_id', image.remove);

};
