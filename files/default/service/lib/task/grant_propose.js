/**
 * Task: GrantPropose
 */
var Model = require("../model");
var Util = require("../util");

module.exports = function(grantor, grantee, grant, callback) {
    function task(next, grant) {
        Model.exists("subject", grantor, function(err, grantor) {
            if (err)
                return next(err);
            Model.exists("subject", grantee, function(err, grantee) {
                if (err)
                    return next(err);
                Model.exists("grant", grant, function(err, grant) {
                    if (err)
                        return next(err);
                    
                    // Validate that Grantee is allowed to fulfill the Grant
                    var proposed = grant.createPermissions(grantor, grantee);
                    var allowed = [], denied = [];
                    grantee.permissions(function(err, permissions) {
                        if (err)
                            return next(err);

                        proposed.each(function(perm) {
                            if (permissions.can(perm))
                                allowed.push(perm);
                            else
                                denied.push(perm);
                        });
                        next(null, {
                            grant : grant.id,
                            temp : grant.temp,
                            allowed : allowed,
                            denied : denied
                        });
                    });
                });
            });
        });
    }

    if (typeof callback === "function")
        task(callback, grant);
    return task;
};
