/**
 * MiddleWare: Authorize
 */
var RESTify = require("restify");
var Subject = require("../model/subject");

exports = module.exports = function() {
    return (function(req, res, next) {
        Subject.permissions({
            platform : config.platform,
            service : config.service,
            actions : req.method,
            owner : config._tenant
        }, function(err, perms) {
            if (err)
                return next(err);
            
            perms.parameters.$merge({
                subject : req.subject,
                tenant : req.subject.tenant
            });

            next(perms.can({
                resource : req.path.split("/"),
                actions : req.method,
            }) ? null : new RESTify.NotAuthorizedError("Inadequate Permission"));
        });
    });
};
