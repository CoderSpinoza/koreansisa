var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var should = chai.should();

describe('protractor library', function() {
	it('should expose the correct global variables', function() {
		protractor.should.exist;
	});
});

describe('Visiting /', function() {
	it('should have a right title', function() {
		browser.get('/');
		expect(browser.getTitle()).to.eventually.equal('Korean Sisa');
	});
});