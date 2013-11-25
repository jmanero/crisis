/**
 * Control: Entity
 * 
 * Resource accessors for the internal model
 */
var Tenant = require("../model/tenant");
var Model = {
    group : require("../model/group"),
    permission : require("../model/permission"),
    user : require("../model/user")
};

exports.route = function(service) {
    // Tenant
    service.post("/tenant", function(req, res, next) {

    });
    service.get("/tenant/:tenant", function(req, res, next) {

    });
    service.put("/tenant/:tenant", function(req, res, next) {

    });
    service.del("/tenant/:tenant", function(req, res, next) {

    });

    // Sub-Entities
    Object.keys(Model).forEach(function(entity) {
        service.post("/tenant/:tenant/" + entity, function(req, res, next) {

        });
        
        var path = "/tenant/:tenant/" + entity + "/:" + entity;
        service.get(path, function(req, res, next) {

        });
        service.put(path, function(req, res, next) {

        });
        service.del(path, function(req, res, next) {

        });
    });
};
