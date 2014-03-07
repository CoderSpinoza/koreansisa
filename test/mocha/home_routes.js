var request = require('request');
var mocha = require('mocha');
var chai = require('chai');
var should = chai.should();

var serverPath = 'http://localhost:5000';

describe('Index', function() {
  it('should be a successful response', function(done) {
    return request({url: serverPath, method: "GET"}, function(err, res, body) {
    	should.not.exist(err);
      res.statusCode.should.equal(200);
      return done();
    });
  });
});