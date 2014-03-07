var request = require('request');
var serverPath = 'http://localhost:5000';
var DatabaseCleaner = require('database-cleaner');
var databaseCleaner = new DatabaseCleaner('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/koreansisa_test');

after(function(done) {
	databaseCleaner.clean(mongoose.connections[0].db, function(err) {
		console.log("Beginning: Test database cleared");
		return done();
	});
});

describe ("User", function() {
	this.timeout(10000);
	describe('Register', function() {
		describe('with a valid parameters', function() {
			it('should return a success response', function(done) {
				var parameters = {email: 'hara0115@gmail.com', password: 'gkfkthdus1', gender: true, name: 'Hara Kang', confirmation: 'gkfkthdus1'};
				return request.post({url: serverPath + '/register', form: parameters}, function(err, response, body) {
					// should.not.exist(err);
					response.statusCode.should.equal(200);
					return done();
				});
			});
		});
	});

	describe('Logging in', function() {
		describe('with a valid parameters', function() {
			it('should return a success response', function(done) {
				var parameters = { email: 'hara0115@gmail.com', password: 'gkfkthdus1'};
				return request.post({url: serverPath + '/login', form: parameters}, function(err, response, body) {
					response.statusCode.should.equal(200);
					return done();
				});
			});
		});
	});
});

after(function(done) {
	databaseCleaner.clean(mongoose.connections[0].db, function(err) {
		console.log("End: Test database cleared");
		return done();
	});
});