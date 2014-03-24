
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var mongoose = require('mongoose');
var DatabaseCleaner = require('database-cleaner');
var databaseCleaner = new DatabaseCleaner('mongodb');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var LocalAPIKeyStrategy = require('passport-localapikey').Strategy;

env = require('node-env-file');

var app = express();

process.env.PWD = process.cwd();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('test_port', 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(require('connect-multiparty')());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(process.env.PWD, 'app/public')));
app.use(express.static(path.join(process.env.PWD, 'bower_components')));
app.use(express.static(path.join(process.env.PWD, 'app/views')));

env(process.env.PWD + '/.env');
// development only
if (app.get('env') == 'development') {
  app.use(express.errorHandler());
}

// passport config
var User = require('./api/models/user');
passport.use(User.createStrategy());
passport.use(new LocalAPIKeyStrategy(function(apikey, done) {
	User.findOne({apikey: apikey}, function(err, user) {
		if (err) return done(err);
    if (!user) return done(null, false);
    return done(null, user);
	});
}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// connect to mongoose

var mongooseUri = process.argv[2] === "test" ? 'mongodb://localhost/koreansisa_test' : process.env.MONGOHQ_URL || 'mongodb://localhost/koreansisa';
mongoose.connect(mongooseUri, function(err, res) {
	if (err) {
		console.log("Error connecting to " + mongooseUri + ": " + err);
	} else {
		console.log("Successfully connected to " + mongooseUri);
	}
});

// routing
require('./api/routes')(app);

// create a server

var port = process.argv[2] !== "test" ? app.get('port') : app.get('test_port');
http.createServer(app).listen(port, function(){
  console.log('Express server listening on port ' + port);
});
