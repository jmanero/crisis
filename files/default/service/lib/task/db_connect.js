/**
 * Task: DBConnect
 */
var Mongoose = require("mongoose");
module.exports = function dbConnect(_config) {
    // Override global config
    config = config.merge(_config || {});
    
    return function(next) {
        Mongoose.connect(config.database);
        Mongoose.connection.on("connected", function() {
            log.info("Connected to " + config.database);
            next();
        });
    };
};
