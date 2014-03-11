var passport = require('passport');
var User = require('../models/user');
/*
 * GET users listing.
 */

module.exports = function(app) {
	app.post('/register', function(req, res) {
		User.register(req.body, req.body.password, function(err, user) {
			if (err) return res.status(401).send({ message: err.toString(), user: user});
			passport.authenticate('local')(req, res, function() {
				return res.status(200).send({user: user});
			});
		});
	});

	app.post('/login', function(req, res) {
		passport.authenticate('local', function(err, user, info) {
			if (err) return res.status(401).send({message: "There was an error processing your login request."});
			if (!user) return res.status(404).send({message: "Invalid email or password."});
			console.log("passed errors");
			return res.send({message: "Successfully logged in", user: user});
		})(req, res);
	});

	app.post('/logout', function(req, res) {
		req.logOut();
		return res.status(200).send();
	});

	app.get('/api/authenticate', function(req, res) {
		User.findOne({apikey: req.query.token}, function(err, user) {
			return res.send({user: user});
		});
	});

	app.get('/user/facebook', function(req, res) {
		User.findOne({ facebookId: req.query.fbId}, function(err, user) {
			if (user) return res.send({ user: user});
			User.findOne({ email: req.query.email}, function(err, user) {
				if (user) return res.send({user: user});
				return res.status(404).send({});
			});
			
		});
	});

	app.get('/user/twitter', function(req, res) {
		User.findOne({ twitterId: req.query.twitterId}, function(err, user) {
			if (user) return res.send({user: user});
			return res.status(404).send();
		});
	});

	app.get('/twitter/connect', function(req, res) {
		User.findById(req.query.id, function(err, user) {
			if (user) {
				user.twitterId = req.query.twitterId;
				user.twitter = true;
				user.save(function(err) {
					if (err) return res.status(400);
					return res.send({user: user, message: "Successfully connected twitter account."});
				});
			} else {
				return res.status(404);
			}
		});
	});
};
