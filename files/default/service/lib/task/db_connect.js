/**
 * Task: DBConnect
 */
var Mongoose = require("mongoose");
module.exports = function dbConnect(next) {
    Mongoose.connect(config.database);
    Mongoose.connection.on("connected", function() {
        log.info("Connected to " + config.database);
        next();
    });
};
