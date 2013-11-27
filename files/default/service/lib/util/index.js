/**
 * Util++
 */
var Util = require("util");
var Truck = require("./truck");

exports = module.exports = Truck.load(__dirname);
exports.$merge(Util);
