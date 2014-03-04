
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// development only
if (app.get('env') == 'development' ) {
  app.use(express.errorHandler());
}

// passport config
var Account = require('./models/user');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// connect to mongoose
var mongooseUri = process.env.MONGOHQ_URL || 'mongodb://localhost/koreansisa';

mongoose.connect(mongooseUri, function(err, res) {
	if (err) {
		console.log("Error connecting to " + mongooseUri + ": " + err);
	} else {
		console.log("Successfully connected to " + mongooseUri);
	}
});

// routing
require('./routes')(app);

// create a server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
