var Issue = require('../models/issue');

module.exports = function(app) {

	app.get('/issues', function(req, res) {

	});

	app.post('/issues', function(req, res) {
		Issue.create(req.body, function(err, issue) {
			console.log(issue);
			if (err) {
				console.log(err.toString()); 
				console.log(issue);
				return res.status(400).send(err);
			}
			return res.send({message: "Sucessfully created an issue.", issue: issue});
		});
	});
};