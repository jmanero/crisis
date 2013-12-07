/**
 * Task: ServiceConfigure
 * 
 * Create root tenant, and service domain
 */
var Model = require("../model");
var Util = require("../util");

module.exports = function(config, callback) {
    config = $config.merge(config);
    function task(next) {
        Util.train([ Task.domainAdd({
            name : config.domain,
            tenant : $instance.platform,
            inherits : [ $instance.service ]
        }), function(next, domain) {
            $instance.domain = domain;
            next();
        } ], next);
    }

    if (typeof callback === "function")
        task(callback);
    return task;
};

var Task = Util.truck.load(__dirname);
