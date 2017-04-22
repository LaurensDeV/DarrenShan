var express = require('express');
var books = require('../books.json');

var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', books);
});

module.exports = router;
