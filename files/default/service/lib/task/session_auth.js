/**
 * Task: SessionAuth
 */
var InvalidCredentialsError = require("restify").InvalidCredentialsError;
var Model = require("../model");
var ResourceNotFoundError = require("restify").ResourceNotFoundError;
var Util = require("../util");

module.exports = function(params, user, password, callback) {
    function task(next) {
        Model.subject.findOne({
            name : user,
            type : "User"
        }, function(err, user) {
            if (err)
                return next(err);
            if (!user || !user.signin(password))
                return next(new InvalidCredentialsError());
            
            Model.session.get(params.service, params.session, function(err, session) {
                if (err)
                    return next(err);
                if (!session)
                    return next(new ResourceNotFoundError("Invalid session"));
                if (session.user)
                        return next(new PreconditionFailedError("Session is already authenticated"));

                session.type = "signed";
                session.user = user.id;
                session.save(function(err) {
                    if (err)
                        return callback(err);
                    next(null, session);
                });
            });
        })
    }

    if (typeof callback === "function")
        task(callback);
    return task;
};
