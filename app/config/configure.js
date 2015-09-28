var env = process.env.NODE_ENV,
	development = require("./env/development"),
	staging = require("./env/staging"),
	production = require("./env/production");

var config = {
	externalFiles: ["http://www.googletagservices.com/tag/js/gpt.js"],
	staticFiles: ["/app/static/client.js"]
};

if (env === "production") {
	config.port = production.port;
	config.dbUrl = production.dbUrl;
	config.contextServiceUrl = production.contextServiceUrl;
} else if (env === "staging") {
	config.port = staging.port;
	config.dbUrl = staging.dbUrl;
	config.contextServiceUrl = staging.contextServiceUrl;
} else if (env === "development" || !env) {
	config.port = development.port;
	config.dbUrl = development.dbUrl;
	config.contextServiceUrl = development.contextServiceUrl;
}

module.exports = config;