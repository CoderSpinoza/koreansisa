var mongoose = require('mongoose'),
	Post = require('../models/post'),
	Issue = require('../models/issue'),
	User = require('../models/user');

module.exports = function(app) {
	app.post('/api/posts', function(req, res) {
		var post = new Post(req.body);
		post.save(function(err) {
			if (err) return res.status(400).send(err);
			Issue.findById(post.issue, function(err, issue) {
				issue.posts.push(post);
				issue.save(function(err) {
					if (err) return res.status(400).send(err);
					User.findById(post.author, function(err, user) {
						if (err) return res.status(400).send(err);
						user.posts.push(post);
						user.save(function(err) {
							return res.send({post: post});
						});
						
					})
					
				});
			});			
		});
	});
};