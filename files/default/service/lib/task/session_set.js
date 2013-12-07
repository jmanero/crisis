/**
 * Task: SessionSet
 */
var ResourceNotFoundError = require("restify").ResourceNotFoundError;
var Session = require("../model/session");
var Util = require("../util");

module.exports = function(params, data, callback) {
    function task(next, data) {
        Session.get(params.service, params.session, function(err, session) {
            if (err)
                return next(err);
            if (!session)
                return next(new ResourceNotFoundError());

            session.data.$merge(data);
            session.save(function(err) {
                if (err)
                    return callback(err);
                next(null, session);
            });
        });
    }

    if (typeof callback === "function")
        task(callback, data);
    return task;
};
