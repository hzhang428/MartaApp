var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/createstation', function(req, res, next) {
  res.render('createstation', null);
});

router.get('/updatestation', function(req, res, next) {
  res.render('updatestation', null);
})

module.exports = router;
