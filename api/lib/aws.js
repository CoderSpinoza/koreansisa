var crypto = require( "crypto");

exports.credentials = function(mimeType, cb) {
	var policy, date, policyBase64;
	date = new Date(Date.now() + 1000 * 60 * 60);
	policy = {
		"expiration": date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate() + "T" + date.getUTCHours() + ":" + date.getMinutes() + ":" + date.getUTCSeconds() + ".000Z",
		conditions: [
			{"bucket": "koreansisa"},
      ["starts-with", "$key", "images"], 
      { "acl": "public-read" }, 
      ["content-length-range", 0, 2147483648], 
      ["starts-with", "$Content-Type", "image"]
		]
	};

	console.log(JSON.stringify(policy));
	var encoded = new Buffer(JSON.stringify(policy)).toString('base64');
	console.log(encoded);
	var credentials = {
		policyBase64: encoded,
    signature: crypto.createHmac("sha1", process.env.AWS_SECRET_ACCESS_KEY).update(encoded).digest("base64"),
    s3Key: process.env.AWS_ACCESS_KEY_ID,
    s3Policy: policy
	};
	return cb(null, credentials);
};