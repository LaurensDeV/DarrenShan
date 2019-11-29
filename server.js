var request = require('request');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
var books = require('./routes/books');

//Init App
var app = express();

//Configure handlebars
var hbs = exphbs.create({
  defaultLayout: 'layout',
  helpers: {
    section: function(name, options) {
      if(!this._sections)
        this._sections = { };
      this._sections[name] = options.fn(this);
      return null;
    },
    attr: function(name, data) {
      if(typeof target === 'undefined') target = "";
      var result = ' ' + name + '="' + data +  '" ';
      return result;
    },
    counter: function(index) {
      return index + 1;
    }
  }
});

//View engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Set static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express session
app.use(session({
  secret: 'mfqlsjfqzpaoiefjapeoijf',
  saveUninitialized: true,
  resave: true
}));

//Passport init
app.use(passport.initialize());
app.use(passport.session());

//Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

//Connect flash
app.use(flash());

var status;

app.use(function(req, res, next) {
  console.log(req.connection.remoteAddress + " requested: " + req.url);
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


app.use('/', routes);
app.use('/books', books);
app.set('port', process.env.PORT || 80);

app.listen(app.get('port'), function() {
  console.log('Server started on port ' + app.get('port'));
});
