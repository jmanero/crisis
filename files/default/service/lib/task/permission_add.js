/**
 * Task: UserAdd
 */
var Model = require("../model");
var Util = require("../util");

module.exports = function(permission, callback) {
    function task(next, applicant) {
        applicant = applicant || permission.applicant;
        Model.exists("tenant", permission.platform, function(err, platform) {
            if (err)
                return next(err);
            permission.platform = platform;

            Model.exists("subject", permission.service, function(err, service) {
                if (err)
                    return next(err);
                if (service.type !== "Service")
                    return next(new TypeError("Subject " + permission.service + " is not a Service"));
                permission.service = service;

                Model.exists("tenant", permission.owner, function(err, owner) {
                    if (err)
                        return next(err);
                    permission.owner = owner;

                    Model.exists("subject", applicant, function(err, applicant) {
                        if (err)
                            return next(err);
                        permission.applicant = applicant;

                        Model.ensure("permission", platform.name + "::" + service.name + "::" + permission.resource.join("/"), {
                            platform : platform.id,
                            service : service.id,
                            resource : permission.resource,
                            applicant : applicant.id
                        }, permission, next);
                    });
                });
            });
        });
    }

    if (typeof callback === "function")
        task(callback);
    return task;
};
