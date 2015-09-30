var mongoose = require('mongoose'),
    babel = require('babel/polyfill'),
    Controller = require('./controller');

var TagManager = function(options, next) {
    if (mongoose.connection.readyState != 1) mongoose.connect(options.config.dbUrl);
    return Controller(options, next);
};

module.exports = TagManager;
