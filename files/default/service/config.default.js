/**
 * Configuration
 */
var OS = require("os");

module.exports = {
    database : "mongodb://localhost/crisis",
    session : [ "localhost:11211" ],
    listen : 9090,
    tenant : "_default",
    platform : "_default",
    service : "identity",
    subject : OS.hostname()
};
