var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var Comment = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	post: {
		type: Schema.Types.ObjectId,
		ref: 'Post',
		required: true
	},
	text: {type: String, required: true},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Comment', Comment);