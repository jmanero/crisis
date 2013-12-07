/**
 * Task: DBConnect
 */
var Mongoose = require("mongoose");
var Util = require("../util");

module.exports = function dbConnect(config) {
    // Override global config
    config = $config.merge(config);
    
    return function(next) {
        Mongoose.connect(config.database);
        Mongoose.connection.on("error", function(err) {
            next(err);
        });
        Mongoose.connection.on("connected", function() {
            $log.info("Connected to " + config.database);
            next();
        });
    };
};
