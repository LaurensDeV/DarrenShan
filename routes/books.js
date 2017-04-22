var express = require('express');
var books = require('../books.json').books;

var router = express.Router();

router.get('/', function(req, res) {
  var id = parseInt(req.query.book);
  var page = parseInt(req.query.page);

  if(!id || !page || id < 1 || page < 1 ||id > books.length || page > books[id -1].pages.length)
  {
    res.redirect('/');
    return;
  }


  var nextid = page === books[id -1 ].pages.length ? id + 1 : id;
  var nextpage = nextid === id ? page + 1 : 1;
  var next = "window.location.href='/books?book=" + nextid + "&page=" + nextpage + '\'';
  if(nextid > books.length)
    next = "window.location.href= '/'";

  res.render('books', {
      title: books[id -1].title,
      page: books[id -1].pages[page -1],
      next: next,
      pid: page,
      pmax: books[id -1].pages.length
    });
});

module.exports = router;
