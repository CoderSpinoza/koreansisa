var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose'),
	jwt = require('jwt-simple'),
	secret = 'koreansisa';

var User = new Schema({
	email: {type: String, trim: true, unique: true, required: true},
	name: {type: String, trim: true, required: true},
	gender: {type: Boolean, required: true},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now},
	apikey: {type: String},
	facebook: {type: Boolean, default: false},
	twitter: { type: Boolean, default: false},
	facebookId: { type: String },
	twitterId: { type: String },
	role: {type: String, default: "user"}
});

User.plugin(passportLocalMongoose, {
	usernameField: 'email',
	usernameLowerCase: true
});

User.pre('init', function(next) {
	self = this;
	var token = jwt.encode(self, secret);
	self.apikey = token;
	next();
});

User.pre('save', function(next) {
	self = this;
	self.updatedAt = Date.now;
	next();
})

module.exports = mongoose.model('User', User);