/**
 * Configuration
 */
var OS = require("os");

module.exports = {
    listen : 8080,
    session : "localhost:9090",
    platform : "_default",
    service : "Identity",
    domain : OS.hostname() + "-UI"
};
