/**
 * Task: AdminConfigure
 * 
 * Create Administrative policies
 */
var Model = require("../model");
var Util = require("../util");

module.exports = function(callback) {
    function task(next) {
        Util.train([ Task.groupAdd({
            name : "Administrator",
            tenant : $instance.platform
        }), function(next, group) {
            $instance.administrators = group;
            next(null, group);
        }, Task.permissionAdd({ // Administrators can do anything
            platform : $instance.platform,
            service : $instance.service,
            owner : $instance.platform,
            resource : [ "*" ],
            actions : [ "*" ],
            effect : "Allow"
        }) ], next);
    }

    if (typeof callback === "function")
        task(callback);
    return task;
};

var Task = Util.truck.load(__dirname);
