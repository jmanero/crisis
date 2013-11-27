/**
 * MiddleWare: Authenticate
 */
var Crypto = require("crypto");
var RESTify = require("restify");
var Key = require("../model/key");

function sha1(data) {
    var hasher = Crypto.createHash("sha1");
    hasher.update(data);

    return hasher.digest("base64");
}

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

        Key.findById(key).populate("user").exec(function(err, key) {
            if (err)
                return next(err);
            if (!key)
                return next(new RESTify.NotAuthorizedError("Invalid key ID"));

            var hmac = Crypto.createHmac("sha256", key.secret);
            hmac.digest(cannonical);
            var check = hmac.digest("base64");
            
            if(check !== challenge)
                return next(new RESTify.NotAuthorizedError("Invalid HMAC challenge"));
            
            req.user = key.user;
            next();
        });
    });
};

function bySession() {
    return (function(req, res, next) {
        res.send(501);
    });
};

exports = module.exports = function() {
    var key = byKey();
    var session = bySession();

    return (function(req, res, next) {
        var method = req.headers["x-auth-method"];
        console.log(method);

        if (method == "Key-v1.0")
            return key(req, res, next);

        if (method == "Session-v1.0")
            return session(req, res, next)

        return next(new RESTify.MissingParameterError("Invalid X-Auth-Method"));
    });
};

exports.byKey = byKey;
exports.bySession = bySession;
