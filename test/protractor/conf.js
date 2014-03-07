exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	capabilities: {
		'browserName': 'chrome'
	},
	framework: 'mocha',
	specs: ['*_spec.js'],
	baseUrl: 'http://localhost:5000'
};