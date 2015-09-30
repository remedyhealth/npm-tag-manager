var path = require('path'),
	http = require('http'),
	fs = require('fs'),
	request = require('request'),
	REQUEST_TIMEOUT = 1000;


exports.getStatic = function(files, output, callback, id) {
	if (!files || !files.length) {
		callback(output);
		return;
	};
	if (!output) output = "\n";
	for (var f = 0, len = files.length; f < len; f++) {
		var file = files[f];
		var filePath = path.resolve(file);

		fs.readFile(filePath, "utf8", function(err, data) {
			if (err) {
				console.log("\t* Error: " + err);
				callback(output);
				return;
			}
			output += "//Including static file: " + file + "\n";
			output += data;
			if (f >= len) {
				if (id) console.log("\t* Got static files for ad #" + id + "!");
				callback(output);
			}
		});
	}
}

exports.getRemote = function(files, output, callback, id) {
	if (!files || !files.length) {
		callback(output);
		return;
	};
	if (!output) output = "";

	for (var f = 0, len = files.length; f < len; f++) {
		var file = files[f];
		console.log("\t* Getting " + file);
		request({
				method: "GET",
				uri: file,
				encoding: "UTF8",
				timeout: REQUEST_TIMEOUT
			},
			function(err, res, body) {
				if (err) {
					console.log("\t* Error: " + err);
					callback(output);
					return;
				}
				output += "//Including external file: " + file + "\n";
				output += body;
				if (f >= len) {
					if (id) console.log("\t* Got external files for ad #" + id + "!");
					callback(output);
				}
			}
		);
	}
}
