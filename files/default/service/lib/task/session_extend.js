/**
 * Task: SessionExtend
 */
var ResourceNotFoundError = require("restify").ResourceNotFoundError;
var Session = require("../model/session");
var Util = require("../util");

module.exports = function(child, parent, callback) {
    function task(next) {
        Session.get(child.service, child.session, function(err, child) {
            if (err)
                return next(err);
            if (!child)
                return next(new ResourceNotFoundError("Invalid child session"));
            if (child.user)
                return next(new PreconditionFailedError("Child session is already authenticated"));

            Session.get(parent.service, parent.session, function(err, parent) {
                if (err)
                    return next(err);
                if (!parent)
                    return next(new ResourceNotFoundError("Invalid parent session"));
                if (!parent.user)
                    return next(new PreconditionFailedError("Parent session is not authenticated"));

                parent.children.push(child);
                session.type = "extended";
                child.user = parent.user;

                child.save(function(err) {
                    if (err)
                        return next(err);
                    parent.save(function(err) {
                        if (err)
                            return next(err);
                        next(null, child);
                    })
                });
            });
        });
    }

    if (typeof callback === "function")
        task(callback);
    return task;
};
