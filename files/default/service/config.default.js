/**
 * Configuration
 */
var OS = require("os");

module.exports = {
    database : "mongodb://localhost/crisis",
    session : [ "localhost:11211" ],
    listen : 9090,
    platform : "_default",
    service : "Identity",
    domain : OS.hostname()
};
