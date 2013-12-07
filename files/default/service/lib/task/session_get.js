/**
 * Task: SessionGet
 */
var ResourceNotFoundError = require("restify").ResourceNotFoundError;
var Session = require("../model/session");
var Util = require("../util");

module.exports = function(params, callback) {
    function task(next) {
        Session.get(params.service, params.session, function(err, session) {
            if (err)
                return next(err);
            if (!session)
                return next(new ResourceNotFoundError());

            session.touch(function(err) {
                if (err)
                    return callback(err);
                next(null, session);
            });
        });
    }

    if (typeof callback === "function")
        task(callback);
    return task;
};
