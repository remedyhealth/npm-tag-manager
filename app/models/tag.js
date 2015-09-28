var mongoose = require("mongoose");
module.exports = mongoose.model("Tag", mongoose.Schema({
	orgId: String,
	userId: String,
	adUnit: String,
	clickUrl: String,
	sizes: [String],
	type: {
		type: String,
		enum: ["script", "iframe", "object"],
		default: "script"
	},
	format: {
		type: String,
		enum: ["dfp-legacy", "gpt", "oas"],
		default: "script"
	},
	targeting: [{
		key: String,
		values: [String]
	}],
	date: {
		type: Date,
		default: Date.now()
	}
}));
