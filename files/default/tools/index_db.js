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
var Util = require("../crisis-service/lib/util");
var Task = require("../crisis-service/lib/task");

log.info("Ensure DB Indexes");
Util.train([ Task.dbConnect(), Task.dbIndex() ], function(err) {
    if(err)
        log.error(err);
    else
        log.info("Complete!");
    
    process.exit();
});
