var mongoose = require('mongoose'),
	Comment = require('../models/comment'),
	Post = require('../models/post'),
	User = require('../models/user');

module.exports = function(app) {
	app.post('/api/comments', function(req, res) {
		var comment = new Comment(req.body);
		comment.save(function(err) {
			Post.findById(comment.post).populate('comments').exec(function(err, post) {
				post.comments.push(comment);
				post.save(function(err) {
					User.findById(comment.user, function(err, user) {
						user.comments.push(comment);
						user.save(function(err) {
							Comment.populate(post.comments, {path: 'user'}, function(err, comments) {
								return res.send({message: "Successfully commented on this post", comments: post.comments, comment: comment});
							});
						});
					});
				});
			});
		});
	});
};