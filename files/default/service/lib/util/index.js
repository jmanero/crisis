/**
 * Util++
 */
var Util = require("util");
var Truck = require("./truck");

exports = module.exports = Truck.load(__dirname);
exports.$merge(Util);

// Configuration
global.config = require("../../config.default");
try {
    config.$merge(require("../../config"));
} catch (e) {
    console.log(e);
}

// Logger
global.log = require('bunyan').createLogger({
    name : "Crisis"
});

// Self-Discovery
global.cluster = {};
