var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var Post = new Schema({
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	issue: {
		type: Schema.Types.ObjectId,
		ref: 'Issue'
	},
	side: { type: String, enum: ['Conservative', 'Liberal']},
	comments: [{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}],
	text: {type: String}
});

module.exports = mongoose.model('Post', Post);