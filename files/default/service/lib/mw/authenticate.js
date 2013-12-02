/**
 * MiddleWare: Authenticate
 */
var Crypto = require("crypto");
var RESTify = require("restify");

var Key = require("../model/key");
// var Session = require("../model/session");
var Subject = require("../model/subject");

function byKey() {
    return (function(req, res, next) {
        var cannonical = JSON.stringify({
            date : req.headers["date"],
            method : req.method,
            uri : req.url,
            body : req.digest
        });

        var key = req.headers["x-auth-key"];
        if (!key)
            return next(new RESTify.InvalidHeaderError("Missing X-Auth-Key"));

        var challenge = req.headers["x-auth-hmac"];
        if (!challenge)
            return next(new RESTify.InvalidHeaderError("Missing X-Auth-Hmac"));

        Key.findById(key).populate("subject").exec(function(err, key) {
            if (err)
                return next(err);
            if (!key)
                return next(new RESTify.NotAuthorizedError("Invalid key ID"));

            var hmac = Crypto.createHmac("sha256", key.secret);
            hmac.digest(cannonical);
            var check = hmac.digest("base64");

            if (check !== challenge)
                return next(new RESTify.NotAuthorizedError("Invalid HMAC challenge"));

            key.subject.populate("tenant", function(err, key) {
                if (err)
                    return next(err);

                req.subject = key.subject;
                next();
            });
        });
    });
};

function bySession() {
    return (function(req, res, next) {
        // No session store implemented yet
        return res.send(501);

        var cannonical = JSON.stringify({
            date : req.headers["date"],
            method : req.method,
            uri : req.url,
            body : req.digest
        });

        var id = req.headers["x-auth-session"];
        if (!id)
            return next(new RESTify.InvalidHeaderError("Missing X-Auth-Session"));

        var challenge = req.headers["x-auth-hmac"];
        if (!challenge)
            return next(new RESTify.InvalidHeaderError("Missing X-Auth-Hmac"));

        Session.get(id, function(err, session) {
            if (err)
                return next(err);
            if (!session)
                return next(new RESTify.NotAuthorizedError("Invalid session ID"));

            var hmac = Crypto.createHmac("sha256", session.token);
            hmac.digest(cannonical);
            var check = hmac.digest("base64");

            if (check !== challenge)
                return next(new RESTify.NotAuthorizedError("Invalid HMAC challenge"));

            Subject.findById(session.subject, function(err, subject) {
                if (err)
                    return next(err);
                if (!subject)
                    return next(new RESTify.NotAuthorizedError("Invalid subject ID associated with session"));

                req.subject = subject;
                next();
            });
        });
    });
};

exports = module.exports = function() {
    var key = byKey();
    var session = bySession();

    return (function(req, res, next) {
        var method = req.headers["x-auth-method"];
        if (method == "Key-v1.0")
            return key(req, res, next);
        if (method == "Session-v1.0")
            return session(req, res, next)

        return next(new RESTify.MissingParameterError("Invalid X-Auth-Method"));
    });
};

exports.byKey = byKey;
exports.bySession = bySession;
