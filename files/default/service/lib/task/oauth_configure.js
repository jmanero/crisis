/**
 * Task: OAuthConfigure
 * 
 * Create root tenant, administrative policies and web service policies
 */
var Model = require("../model");
var Util = require("../util");

module.exports = function(callback) {
    function task(next) {
        Util.train([ Task.serviceAdd({
            name : config.service + "-UI",
            tenant : $instance.platform
        }), function(next, service) {
            $instance.ui_service = service;
            next()
        }, Task.grantAdd({
            name : "OAuth2-Client",
            description : "Allow OAuth2 Clients to create and destroy their Sessions and manage data",
            owner : $instance.platform,
            service : $instance.service,
            permissions : [ {
                resource : [ "service", ":service", "session" ],
                actions : [ "POST" ],
                effect : "Allow"
            }, {
                resource : [ "service", ":service", "session", "*" ],
                actions : [ "DELETE" ],
                effect : "Allow"
            }, {
                resource : [ "service", ":service", "session", "*", "data" ],
                actions : [ "GET", "PUT" ],
                effect : "Allow"
            }, {
                resource : [ "service", ":service", "session", "*", "auth" ],
                actions : [ "GET" ],
                effect : "Allow"
            }, {
                resource : [ "subject", "*", "info" ],
                actions : [ "GET" ],
                effect : "Allow"
            } ]
        }), function(next, grant) {
            Task.grantApply($instance.ui_service, grant, next);
        }, Task.grantAdd({
            name : "OAuth2-Provider",
            description : "Allow OAuth2 Providers to authenticate Sessions",
            owner : $instance.platform,
            service : $instance.service,
            permissions : [ {
                resource : [ "service", "*", "session", "*", "extend" ],
                actions : [ "POST" ],
                effect : "Allow"
            }, {
                resource : [ "service", ":service", "session", "*", "signin" ],
                actions : [ "POST" ],
                effect : "Allow"
            } ]
        }), function(next, grant) {
            Task.grantApply($instance.ui_service, grant, next);
        } ], next);
    }

    if (typeof callback === "function")
        task(callback);
    return task;
};

var Task = Util.truck.load(__dirname);
