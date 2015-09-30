var mongoose = require("mongoose");

var Template = {
	orgId: String,
	userId: String,
	style: {
		type: String,
		enum: ["script", "iframe", "object"],
		default: "script"
	},
	dateCreated: {
		type: Date,
		default: Date.now()
	},
	notes: String
};

var Tag = {
	template: Template,
	model: mongoose.model("Tag", mongoose.Schema(Template, {
		strict: false
	}))
};

module.exports = Tag;
