var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var Issue = new Schema({
	title: {type: String},
	description: {type: String},
	summary: {type: String},
	type: {type: String, enum: ['Political', 'Economic', 'Social']},
	posts: [{
		type: Schema.Types.ObjectId,
		ref: 'Post'
	}],
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Issue', Issue);