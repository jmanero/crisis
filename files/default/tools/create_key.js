#!/usr/bin/env node
/**
 * Tools: CreateKey
 * 
 * Create a user with administrative privileges
 */
process.chdir("/srv/crisis");
var Path = require("path");

var Util = require(Path.join(process.cwd(), "./lib/util"));
var Task = require(Path.join(process.cwd(), "./lib/task"));
var Optimist = require("optimist");

var options = Optimist.options("s", {
    alias : "subject",
    demand : true,
    describe : "User to associate with the new key"
});
options.usage("Create a new key-pair for the specified subject");
var params = options.argv;

$log.info("Creating key for " + params.subject);
Util.train([ Task.dbConnect(), Task.keyAdd(params.subject) ], function(err, key) {
    if (err)
        return $log.error(err);
    $log.info("Complete!");
    console.log(JSON.stringify({
        key : key.id,
        secret : key.secret
    }, null, 2));

    process.exit();
});
