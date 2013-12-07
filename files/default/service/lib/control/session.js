/**
 * 
 */
var Path = require("path");
var RESTify = require("restify");
var Session = require("../model/session");
var Task = require("../task");
var Util = require("../util");

module.exports = function(service) {
    // Initialize an unauthenticated session
    service.post("/service/:service/session", function(req, res, next) {
        Task.sessionAdd(req.params.service, function(err, session) {
            if (err)
                return next(err);
            res.send(201, {
                id : session.id,
                links : [ {
                    rel : "self",
                    href : Path.join(req.path, session.id)
                } ]
            });
        });
    });

    // Authenticate a session
    service.post("/service/:service/session/:session/signin", function(req, res, next) {
        Task.sessionExtend(req.params, req.body, function(err, session) {
            if (err)
                return next(err);
            res.send(session.auth);
        });
    });

    // Tie a Service session to an Identity session
    service.post("/service/:service/session/:session/extend", function(req, res, next) {
        Task.sessionExtend(req.params, req.body, function(err, session) {
            if (err)
                return next(err);
            res.send(session.auth);
        });
    });

    // Generate a Grant Proposal
    service.post("/service/:service/session/:session/propose", function(req, res, next) {
        Task.sessionGet(req.params, function(err, session) {
            if (err)
                return next(err);
            if (session.type !== "signed")
                return next(new PreconditionFailedError("Session is not authenticated"));
            if(!Array.isArray(req.body.grants) || !req.body.grants.length)
                return res.send([]);

            Task.grantPropose(session.user, req.body.client, req.body.grants, function(err, proposals) {
                if (err)
                    return next(err);
                res.send(proposals)
            });
        });
    });

    // Fetch session authentication
    service.get("/service/:service/session/:session/auth", function(req, res, next) {
        Task.sessionGet(req.params, function(err, session) {
            if (err)
                return next(err);
            res.send({
                id : session.id,
                owner : session.owner,
                user : session.user,
                token : session.token,
            });
        });
    });

    // Session data
    service.get("/service/:service/session/:session/data", function(req, res, next) {
        Task.sessionGet(req.params, function(err, session) {
            if (err)
                return next(err);
            res.send(session.data);
        });
    });
    service.put("/service/:service/session/:session/data", function(req, res, next) {
        Task.sessionSet(req.params, req.body, function(err, session) {
            if (err)
                return next(err);
            res.send(session.data);
        });
    });

    // Purge session
    service.del("/service/:service/session/:session", function(req, res, next) {
        Task.sessionDel(req.params, function(err) {
            if (err)
                return next(err);
            res.send(204);
        });
    });
};
