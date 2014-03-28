'use strict';
var multiparty = require('multiparty');
var aws = require('../lib/aws');

module.exports = function(app) {
	app.post('/api/images', function(req, res) {
		var form = new multiparty.Form({maxFieldsSize: 1024 * 1024 * 1024});
		return form.parse(req, function(err, fields, files) {
			var file = fields.file[0].split(',')[1];
			var data = files.data[0];
			var path = "images/" + new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate() + "/" + Date.now() + "/" + data.originalFilename;
			return aws.upload(path, data.headers["content-type"], file, function(err, result) {
				if (err) return res.status(400).send();
				return res.send({message: "Success", result: result});
			});
		});
	});

	app.get('/api/s3/credentials/:mimeType', function(req, res) {
		return aws.credentials(req.params.mimeType, function(err, result) {
			if (err) return res.status(400).send();
			return res.send({credentials: result});
		})
	});
};