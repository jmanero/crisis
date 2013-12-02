/**
 * Task: DBIndex
 * 
 * Ensure that all indexes exist
 * 
 * *WARNING* Do not run this task during normal operation! Indexing in
 * MongoDBLand is a globally blocking process that can take a long time if your
 * database already contains many documents.
 */
var Model = require("../model");
var Util = require("../util");

module.exports = function() {
    return function(next) {
        Util.train(Model.entities.map(function(model) {
            return function(next) {
                log.info("Indexing " + model);
                Model[model].ensureIndexes(function(err) {
                    next(err);
                });
            };
        }), next);
    }
};
