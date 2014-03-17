var Issue = require('../models/issue');
var Post = require('../models/post');

module.exports = function(app) {

	app.get('/api/issues', function(req, res) {
		Issue.find({}).populate('posts').exec(function(err, issues) {
			if (err) return res.status(400).send(err);
			return res.send({message: "Successfully fetched issues.", issues: issues});
		});
	});

	app.post('/api/issues', function(req, res) {
		Issue.create(req.body, function(err, issue) {
			if (err) return res.status(400).send(err);
			return res.send({message: "Sucessfully created an issue.", issue: issue});
		});
	});

	app.get('/api/issues/:issueId', function(req, res) {
		Issue.findById(req.params.issueId).populate('posts').exec(function(err, issue) {
			if (err) return res.status(400).send(err);
			if (!issue) return res.status(404).send();
			Post.populate(issue.posts, {path: 'author'}, function(err, posts) {
				if (err) return res.status(400).send(err);
				console.log(issue);
				return res.send({issue: issue});
			})
			
		});
	});
};