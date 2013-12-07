/**
 * Control: Entity
 * 
 * Root accessors for all entities
 */
var Path = require("path");
var RESTify = require("restify");
var Model = require("../model");

module.exports = function(service) {
    Model.entities.each(function(name) {
        service.post("/" + name, function(req, res, next) {
            var doc = new Model[name](req.body)
            doc.save(function(err) {
                if (err)
                    return next(err);

                res.send(201, {
                    created : true,
                    links : [ {
                        rel : "self",
                        href : Path.join("/", name, doc.id)
                    } ]
                });
            });
        });

        service.get(Path.join("/", name, ":id"), function(req, res, next) {
            Model[name].findById(req.params.id, function(err, doc) {
                if (err)
                    return next(err);
                if (!doc)
                    return next(new RESTify.ResourceNotFoundError());

                res.send(doc);
            });
        });
        service.put(Path.join("/", name, ":id"), function(req, res, next) {
            Model[name].findById(req.params.id, function(err, doc) {
                if (err)
                    return next(err);
                if (!doc)
                    return next(new RESTify.ResourceNotFoundError());

                doc.$merge(req.body);
                doc.save(function(err) {
                    if (err)
                        return next(err);
                    res.send(doc);
                });
            });
        });
        service.del(Path.join("/", name, ":id"), function(req, res, next) {
            Model[name].findByIdAndRemove(req.params.id, function(err, doc) {
                if (err)
                    return next(err);
                if (!doc)
                    return next(new RESTify.ResourceNotFoundError());

                res.send(204, {
                    deleted : true
                });
            });
        });
    });

    // Cache
    service.get("/cache/:key", function(req, res, next) {
        Model.cache.get(req.params.key, function(err, doc) {
            if (err)
                return next(err);
            if (!doc)
                return next(new RESTify.ResourceNotFoundError());
            res.send(doc);
        });
    });

    service.post("/cache/:key/touch", function(req, res, next) {
        Model.cache.get(req.params.key, function(err, doc) {
            if (err)
                return next(err);
            if (!doc)
                return next(new RESTify.ResourceNotFoundError());

            doc.touch(function(err) {
                if (err)
                    return next(err);
                res.send(202, {
                    touched : true,
                    links : [ {
                        rel : "self",
                        href : Path.join("/cache", doc.id)
                    } ]
                });
            });
        });
    });

    service.put("/cache/:key", function(req, res, next) {
        Model.cache.get(req.params.key, function(err, doc) {
            if (err)
                return next(err);

            doc.$merge(req.body);
            doc.save(function(err) {
                if (err)
                    return next(err);

                res.send(doc);
            });
        });
    });

    service.del("/cache/:key", function(req, res, next) {
        // TODO status? function(err, deleted) {...
        Model.cache.del(req.params.key, function(err) {
            if (err)
                return next(err);
            res.send(204, {
                deleted : true
            });
        });
    });
};
