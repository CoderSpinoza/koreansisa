var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
	email: {type: String, trim: true},
	name: {type: String, trim: true},
	gender: 
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);