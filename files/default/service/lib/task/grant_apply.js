/**
 * Task: GrantApply
 */
var Model = require("../model");
var Util = require("../util");

module.exports = function(grantor, grantee, proposal, callback) {
    function task(next, _proposal) {
        _proposal = _proposal || proposal;
        Model.exists("subject", grantor, function(err, grantor) {
            if (err)
                return next(err);
            Model.exists("subject", grantee, function(err, grantee) {
                if (err)
                    return next(err);
                Model.exists("grant", _proposal.grant, function(err, grant) {
                    if (err)
                        return next(err);
                    grantee.permissions(function(err, permissions) {
                        if (err)
                            return next(err);

                        var tasks = [ Task.groupAdd({
                            name : "Grant-" + grant.name,
                            tenant : grantor.tenant,
                            grant : grant,
                            grantor : grantor
                        }) ];
                        _proposal.permissions.each(function(perm) {
                            if(permissions.can(perm))
                                tasks.push(Task.permissionAdd(perm))
                        });
                        
                        Util.train(tasks, next);
                    });
                });
            });
        });
    }

    if (typeof callback === "function")
        task(callback);
    return task;
};
