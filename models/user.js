var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose'),
	jwt = require('jwt-simple'),
	secret = 'koreansisa';

var User = new Schema({
	email: {type: String, trim: true, unique: true, required: true},
	name: {type: String, trim: true, required: true},
	gender: {type: Boolean, required: true},
	createdDate: {type: Date, default: Date.now},
	apikey: {type: String},
	facebook: {type: Boolean, default: false},
	twitter: { type: Boolean, default: false},
	facebookId: { type: String },
	twitterId: { type: String }
});

User.plugin(passportLocalMongoose, {
	usernameField: 'email',
	usernameLowerCase: true
});

User.pre('save', function(next) {
	self = this;
	var token = jwt.encode(self, secret);
	self.apikey = token;
	next();
});

module.exports = mongoose.model('User', User);