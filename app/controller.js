/**
 * Global variables.
 */
var TagModel = require("./models/tag"),
	ContextModel = require("./models/context"),
	fileLoader = require('./modules/fileLoader'),
	request = require('request'),
	async = require('async'),
	tagCounter = 1,
	networkFiles = {
		gpt: {
			script: {
				externalFiles: ["http://www.googletagservices.com/tag/js/gpt.js"],
				staticFiles: [__dirname + "/clients/gpt-script.js"]
			}
		},
		oas: {
			script: {
				staticFiles: [__dirname + "/clients/oas-script.js"]
			}
		},
		oasjx: {
			script: {
				staticFiles: [__dirname + "/clients/oas-jx-script.js"]
			}
		}
	}

/**
 * Private functions.
 */
// The following private functions (abstracted here for clarity) will later be used in a serial workflow (via async.series).
var _getTagData = function(currentTagNum, id, next) {
		TagModel.model.findOne({
			_id: id
		}, function(err, tagDocument) {
			if (err || !tagDocument) {
				console.log("\t* Error: Failed to get tag data for ad #" + currentTagNum + "!");
				console.log("id: " + id);
			}
			next(err, tagDocument);
			return;
		});
	},
	_getContextData = function(currentTagNum, url, contextServiceUrl, orgId, next) {
		//If there's no referrer, or the tag master already fetched the CT data, skip this step.
		if (/doubleclick.net/.test(url) || url == undefined || url == "") {
			console.log("Skipping contextual targeting data for ad #" + currentTagNum + "...");
			next(null, null);
			return;
		}
		console.log("Fetching contextual targeting data for ad #" + currentTagNum + "...");
		//Get from ct service.
		ContextModel.findOne({
			url: url
		}, function(err, contextDocument) {
			if (err) console.log("* Error retrieving context:", err);
			if (contextDocument) console.log("* Got contextual targeting data from database for ad #" + currentTagNum + "!");
			next(null, contextDocument);

			if (!contextDocument && contextServiceUrl && contextServiceUrl != "") {
				var ctUrl = contextServiceUrl + "/" + orgId + "/?u=" + url;
				console.log("\t* Alert: Contextual targeting data not found for ad #" + currentTagNum + ":", ctUrl);
				request({
						method: "GET",
						uri: ctUrl,
						encoding: "UTF8"
					},
					function(err, res, body) {
						if (err) {
							console.log("\t* Error contacting the Context Service: " + err);
							next(null, null);
							return;
						}
						console.log("* Got contextual targeting data from CT Service for ad #" + currentTagNum + "!"); //:",body);
					}
				);
			}
			return;
		});
	},
	_getStaticFiles = function(currentTagNum, staticFiles, next) {
		console.log("Fetching static files for ad #" + currentTagNum + "...");
		fileLoader.getStatic(staticFiles, null, function(data) {
			next(null, data);
		}, currentTagNum);
	},
	_getExternalFiles = function(currentTagNum, externalFiles, next) {
		console.log("Fetching external files for ad #" + currentTagNum + "...");
		if (!externalFiles || !externalFiles.length) {
			console.log("\t* There are none!");
		};
		fileLoader.getRemote(externalFiles, null, function(data) {
			next(null, data);
		}, currentTagNum);
	};

/**
 * Public API.
 */
var Controller = function(options, next) {
	var currentTagNum = tagCounter++,
		id = options.id,
		url = options.url,
		startTime = Date.now(),
		config = options.config;


	console.log("\nStarting ad #" + currentTagNum + "...");

	async.waterfall([
		function(workflowNext) {
			_getTagData(currentTagNum, id, function(err, result) {
				if (!err && !result) result = err = "No tag found with ID " + id + ".";
				workflowNext(err, {
					tagData: result
				});
			});
		},
		function(results, workflowNext) {
			_getContextData(currentTagNum, url, config.contextServiceUrl, results.tagData.orgId, function(err, result) {
				results.contextData = result;
				workflowNext(err, results);
			});
		},
		function(results, workflowNext) {
			var format = results.tagData._doc.format;
			var style = results.tagData._doc.style;
			var files = networkFiles[format][style].staticFiles || [];
			var staticFiles = (config.staticFiles || []).concat(files);

			_getStaticFiles(currentTagNum, staticFiles, function(err, result) {
				results.staticFiles = result;
				workflowNext(err, results);
			});
		},
		function(results, workflowNext) {
			var format = results.tagData._doc.format;
			var style = results.tagData._doc.style;
			var files = networkFiles[format][style].externalFiles || [];
			var externalFiles = (config.externalFiles || []).concat(files);

			_getExternalFiles(currentTagNum, externalFiles, function(err, result) {
				results.externalFiles = result;
				workflowNext(err, results);
			});
		}
	], function(err, results) {
		console.log("Building output for ad #" + currentTagNum + "...");

		var data = {
				timeForRequest: (Date.now() - startTime) + "ms",
				tag: results.tagData,
				context: results.contextData

			},
			dataString = "var __ad_data = " + JSON.stringify(data, null, "\t") + ";";
		output = dataString;
		if (results.externalFiles) output += results.externalFiles + ";";
		if (results.staticFiles) output += results.staticFiles;
		console.log("Done building data for ad #" + currentTagNum + "!");
		next(output);
	});
};

module.exports = Controller;
