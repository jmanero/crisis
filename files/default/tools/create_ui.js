#!/usr/bin/env node
/**
 * Tools: CreateUI
 * 
 * Create a user with administrative privileges
 */
process.chdir("/srv/crisis");
var Path = require("path");

var Util = require(Path.join(process.cwd(), "./lib/util"));
var Task = require(Path.join(process.cwd(), "./lib/task"));
var Optimist = require("optimist");
var OS = require("os");

var options = Optimist.options("n", {
    alias : "name",
    'default' : OS.hostname() + "-UI",
    describe : "Username for the new UI"
});
options.usage("Create a new domain in the default tenant with UI privileges");
var domain = options.argv;

$log.info("Creating UI " + domain.name);
Util.train([ Task.dbConnect(), Task.serviceConfigure(), Task.oauthConfigure(), function(next) {
    Task.userAdd(domain)
}, , Task.keyAdd() ], function(err, key) {
    if (err)
        return $log.error(err);
    $log.info("Complete!");
    console.log(JSON.stringify({
        key : key.id,
        secret : key.secret
    }, null, 2));

    process.exit();
});
