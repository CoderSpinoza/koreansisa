var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var Post = new Schema({
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	issue: {
		type: Schema.Types.ObjectId,
		ref: 'Issue',
		required: true
	},
	side: { type: String, enum: ['Conservative', 'Liberal'], required: true},
	comments: [{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}],
	title: {type: String, required: true},
	text: {type: String, required: true},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now},
	views: {type: Number, default: 0}
});

module.exports = mongoose.model('Post', Post);