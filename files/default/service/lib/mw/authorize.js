/**
 * MiddleWare: Authorize
 */
var Util = require("../util");
var RESTify = require("restify");
var Subject = require("../model/subject");

exports = module.exports = function() {
    return (function(req, res, next) {
        req.subject.permissions({
            platform : $config.platform,
            service : $config.service,
            actions : req.method,
            owner : cluster.tenant
        }, function(err, perms) {
            if (err)
                return next(err);
            
            next(perms.can({
                resource : req.path.split("/")
            }) ? null : new RESTify.NotAuthorizedError("Permission Denied"));
        });
    });
};
