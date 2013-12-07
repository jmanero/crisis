#!/usr/bin/env node
/**
 * Tools: DBIndex
 * 
 * Ensure that all indexes exist
 * 
 * *WARNING* Do not run this task during normal operation! Indexing in
 * MongoDBLand is a globally blocking process that can take a long time if your
 * database already contains many documents.
 */
process.chdir("/srv/crisis");
var Path = require("path");

var Util = require(Path.join(process.cwd(), "./lib/util"));
var Task = require(Path.join(process.cwd(), "./lib/task"));

$log.info("Ensure DB Indexes");
Util.train([ Task.dbConnect(), Task.dbIndex() ], function(err) {
    if (err)
        return $log.error(err);
    $log.info("Complete!");

    process.exit();
});
