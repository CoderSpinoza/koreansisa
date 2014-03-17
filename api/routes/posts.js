var mongoose = require('mongoose'),
	Post = require('../models/post'),
	Issue = require('../models/issue'),
	User = require('../models/user'),
	Comment = require('../models/comment');

module.exports = function(app) {
	app.get('/api/posts', function(req, res) {
		Post.find({}).populate('author issue').exec(function(err, posts) {
			if (err) return res.status(400);
			return res.send({posts: posts.reverse()});
		});
	});

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

	app.get('/api/posts/:postId', function(req, res) {
		Post.findByIdAndUpdate(req.params.postId, {$inc: { views: 1}}).populate('author issue comments').exec(function(err, post) {
			if (err) return res.status(400).send(err);
			if (!post) return res.status(404).send();
			Comment.populate(post.comments, {path: 'user'}, function(err, comments) {
				if (err) return res.send(400).send(err.toString());
				return res.send({post: post});
			});
			
		});
	});
};