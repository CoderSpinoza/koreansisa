var request = require('request');
describe('Index', function() {
  it('should be a successful response', function() {
    request.get('http://localhost:5000', function(res) {
      res.should.exist;
      res.status.should.equal(200);
      done();
    });
  });
});

