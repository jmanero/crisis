/**
 * Task: SessionDestroy
 */
var ResourceNotFoundError = require("restify").ResourceNotFoundError;
var Session = require("../model/session");
var Util = require("../util");

var sessionDel = module.exports = function(params, callback) {
    function task(next) {
        Session.get(params.service, params.session, function(err, session) {
            if (err)
                return next(err);
            if (!session)
                return next(new ResourceNotFoundError());

            // Delete child sessions first
            Util.train(session.children.map(function(child) {
                return sessionDel({
                    service : child.service,
                    session : child.session
                });
            }), function(err) {
                session.del(next);
            });
        });
    }

    if (typeof callback === "function")
        task(callback);
    return task;
};
