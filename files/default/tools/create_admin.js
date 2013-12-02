#!/usr/bin/env node
/**
 * Tools: CreateAdmin
 * 
 * Create a user with administrative privileges
 */
var Util = require("../crisis-service/lib/util");
var Task = require("../crisis-service/lib/task");
var Optimist = require("optimist");

var options = Optimist.options("n", {
    alias : "name",
    demand : true,
    describe : "Username for the new administrator"
});
options.options("p", {
    alias : "password",
    demand : true,
    describe : "Password for the new administrator"
});
options.usage("Create a new user in the default tenant with administrative privileges");
var user = options.argv;

log.info("Creating administrator " + user.name);
Util.train([ Task.dbConnect(), Task.dbConfigure(), function(next) {
    next(null, {
        inherits : [ cluster.admins ]
    });
}, Task.userAdd(user) ], function(err) {
    if (err)
        log.error(err);
    else
        log.info("Complete!");

    process.exit();
});
