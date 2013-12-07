/**
 * Task: UserAdd
 */
var Model = require("../model");
var Util = require("../util");

module.exports = function(subject, callback) {
    function task(next, tenant) {
        Model.exists("tenant", tenant || subject.tenant, function(err, tenant) {
            if (err)
                return next(err);

            subject.tenant = tenant
            Model.ensure("subject", subject.type + " " + subject.name, {
                name : subject.name,
                tenant : tenant.id
            }, subject, next);
        });
    }

    if (typeof callback === "function")
        task(callback, subject.tenant);
    return task;
};
