var Issue = require('../models/issue');

module.exports = function(app) {

	app.get('/issues', function(req, res) {
		Issue.find({}, function(err, issues) {
			if (err) return res.status(400).send(err);
			return res.send({message: "Successfully fetched issues.", issues: issues});
		});
	});

	app.post('/issues', function(req, res) {
		Issue.create(req.body, function(err, issue) {
			console.log(issue);
			if (err) return res.status(400).send(err);
			return res.send({message: "Sucessfully created an issue.", issue: issue});
		});
	});
};