var mongoose = require('mongoose');
module.exports = mongoose.model('Org',mongoose.Schema({
	name: String,
	domains: [String],
	dictionaries: [mongoose.Schema({
		id: String,
		name: String,
		versions: [mongoose.Schema({
			content: String,
			createdBy: String,
			dateCreated: {
				type: Date,
				default: Date.now(),
				required: true
			}
		})]
	})]
}));
