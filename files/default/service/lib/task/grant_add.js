/**
 * Task: GrantAdd
 */
var Model = require("../model");
var Util = require("../util");

module.exports = function(grant, callback) {
    function task(next) {
        Model.exists("tenant", grant.owner, function(err, owner) {
            if (err)
                return next(err);
            Model.exists("subject", grant.service, function(err, service) {
                if (err)
                    return next(err);

                grant.owner = owner;
                grant.service = service;
                Model.ensure("grant", grant.name, {
                    name : grant.name,
                    owner : owner.id
                }, grant, next);
            });
        });
    }

    if (typeof callback === "function")
        task(callback);
    return task;
};
