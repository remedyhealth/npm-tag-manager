var mongoose = require('mongoose');
module.exports = mongoose.model('Context',mongoose.Schema({
	url: {
		type: String,
		required: true
	},
	canonical: {
		type: String,
		required: true
	},
	dateCreated: {
		type: Date,
		default: Date.now(),
		required: true
	},
	matches: mongoose.Schema.Types.Mixed,
	sources: {
		'url': [String],
		'link|canonical': [String],
		'title': [String],
		'meta|og:title': [String],
		'meta|description': [String],
		'meta|og:description': [String],
		'meta|keywords': [String],
		'meta|og:keywords': [String],
		'body': [String]
	}
}));
