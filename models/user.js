var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
	email: {type: String, trim: true},
	name: {type: String, trim: true},
	gender: {type: Boolean}
});

User.plugin(passportLocalMongoose, {
	usernameField: 'email',
	usernameLowerCase: true
});

module.exports = mongoose.model('User', User);