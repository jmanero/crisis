#!/usr/bin/env node
/**
 * Tools: CreateAdmin
 * 
 * Create a user with administrative privileges
 */
process.chdir("/srv/crisis");
var Path = require("path");

var Util = require(Path.join(process.cwd(), "./lib/util"));
var Task = require(Path.join(process.cwd(), "./lib/task"));
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

$log.info("Creating administrator " + user.name);
Util.train([ Task.dbConnect(), Task.serviceConfigure(), Task.adminConfigure(), function(next) {
    Task.userAdd({
        name : user.name,
        tenant : $instance.platform,
        password : user.password,
        inherits : [ $instance.administrators ]
    }, next);
} ], function(err) {
    if (err)
        return $log.error(err);
    $log.info("Complete!");

    process.exit();
});
