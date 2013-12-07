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
        Util.train([ Task.tenantAdd({
            name : config.platform
        }), function(next, platform) {
            $instance.platform = platform;
            next(null, platform);
        }, Task.serviceAdd({
            name : config.service
        }), function(next, service) {
            $instance.service = service;
            next(null, service);
        } ], next);
    }

    if (typeof callback === "function")
        task(callback);
    return task;
};

var Task = Util.truck.load(__dirname);
