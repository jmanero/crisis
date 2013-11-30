/**
 * MiddleWare: Authorize
 */
var RESTify = require("restify");
var Subject = require("../model/subject");

exports = module.exports = function() {
    return (function(req, res, next) {
        Subject.permissions({
            platform : "_default",
            service : "identity",
            action : req.method,
            owner : foo
        }, function(err, perms) {
            if (err)
                return next(err);

            if (perms.can({
                platform : "_default",
                service : "identity",
                resource : req.path.split("/"),
                action : req.method,
                owner : foo
            })) {
                return next();
            }

            next(new RESTify.NotAuthorizedError("Inadequate Permission"));
        });
    });
};
