#!/usr/bin/env node
/**
 * Tools: CreateKey
 * 
 * Create a user with administrative privileges
 */
var Util = require("../crisis-service/lib/util");
var Task = require("../crisis-service/lib/task");
var Optimist = require("optimist");

var options = Optimist.options("u", {
    alias : "user",
    demand : true,
    describe : "User to associate with the new key"
});
options.usage("Create a new key-pair for the specified user");
var key = options.argv;

log.info("Creating key for " + key.user);
Util.train([ Task.dbConnect(), Task.keyAdd(key) ], function(err, key) {
    if (err)
        log.error(err);
    else {
        log.info("Complete!");
        console.log(JSON.stringify({
            id : key.id,
            secret : key.secret
        }, null, 2));
    }

    process.exit();
});
