var passport = require('passport');
var User = require('../models/user');
/*
 * GET users listing.
 */

module.exports = function(app) {
	app.post('/api/register', function(req, res) {
		User.register(req.body, req.body.password, function(err, user) {
			if (err) return res.status(401).send({ message: err.toString(), user: user});
			passport.authenticate('local')(req, res, function() {
				return res.status(200).send({user: user});
			});
		});
	});

	app.post('/api/login', function(req, res) {
		passport.authenticate('local', function(err, user, info) {
			if (err) return res.status(401).send({message: "There was an error processing your login request."});
			if (!user) return res.status(404).send({message: "Invalid email or password."});
			console.log("passed errors");
			return res.send({message: "Successfully logged in", user: user});
		})(req, res);
	});

	app.post('/api/logout', function(req, res) {
		req.logOut();
		return res.status(200).send();
	});


	app.put('/api/users/:userId', function(req, res) {
		delete req.body["_id"];
		User.findByIdAndUpdate(req.params.userId, req.body, {}, function(err, user) {
			console.log(err);
			if (!user) return res.status(404).send({message: "User not found."});
			return res.send({message: "You have successfully updated your profile", user: user});
		});
	});

	app.get('/api/authenticate', function(req, res) {
		User.findOne({apikey: req.query.token}, function(err, user) {
			return res.send({user: user});
		});
	});

	app.get('/api/user/facebook', function(req, res) {
		User.findOne({ facebookId: req.query.fbId}, function(err, user) {
			if (user) return res.send({ user: user});
			User.findOne({ email: req.query.email}, function(err, user) {
				if (user) return res.send({user: user});
				return res.status(404).send({});
			});
			
		});
	});

	app.get('/api/user/twitter', function(req, res) {
		User.findOne({ twitterId: req.query.twitterId}, function(err, user) {
			if (user) return res.send({user: user});
			return res.status(404).send();
		});
	});

	app.put('/api/facebook/connect', function(req, res) {
		User.findById(req.query.id, function(err, user) {
			if (!user) return res.status(404).send({message: "User not found."});
			user.facebook = true;
			user.facebookId = req.query.facebookId;
			user.save(function(err) {
				if (err) return res.status(400).send({message: err.toString()});
				return res.send({message: "Successfully connected your facebook account.", user: user});
			})
		})
	});

	app.put('/api/facebook/disconnect', function(req, res) {
		User.findById(req.query.id, function(err, user) {
			if (!user) return res.status(404);
			user.facebook = false;
			user.facebookId = undefined;
			user.save(function(err) {
				if (err) return res.status(400);
				return res.send({user: user, message: "Successfully disconnected your facebook account."});
			})
		})
	});

	app.put('/api/twitter/connect', function(req, res) {
		User.findById(req.query.id, function(err, user) {
			if (user) {
				user.twitterId = req.query.twitterId;
				user.twitter = true;
				user.save(function(err) {
					if (err) return res.status(400);
					return res.send({user: user, message: "Successfully connected your twitter account."});
				});
			} else {
				return res.status(404);
			}
		});
	});

	app.put('/api/twitter/disconnect', function(req, res) {
		User.findById(req.query.id, function(err, user) {
			if (!user) return res.status(404);
			user.twitter = false;
			user.twitterId = undefined;
			user.save(function(err) {
				if (err) return res.status(400);
				return res.send({user: user, message: "Successfully disconnected your twitter account."});
			});
		});
	});
};
