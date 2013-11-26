/**
 * Control: Entity
 * 
 * Resource accessors for the internal model
 */
var Hoek = require("hoek");
var Path = require("path");

var Model = {
    tenant : require("../model/tenant"),
    permission : require("../model/permission"),
    subject : require("../model/subject"),
    key : require("../model/key")
};

exports.route = function(service) {
    Object.keys(Model).forEach(function(name) {
        service.post("/" + name, function(req, res, next) {
            (new Model[name](req.body)).save(function(err) {
                if (err)
                    return next(err);

                res.link("self", Path.join("/", name, this._id));
                res.send(201);
            });
        });

        service.get(Path.join("/", name, ":id"), function(req, res, next) {
            Model[name].findById(req.params.id, function(err, doc) {
                if (err)
                    return next(err);
                if (!doc)
                    return res.send(404);

                res.send(doc);
            });
        });
        service.put(Path.join("/", name, ":id"), function(req, res, next) {
            Model[name].findById(req.params.id, function(err, doc) {
                if (err)
                    return next(err);
                if (!doc)
                    return res.send(404);

                Hoek.merge(doc, req.body);
                res.send(doc);
            });
        });
        service.del(Path.join("/", name, ":id"), function(req, res, next) {
            Model[name].findByIdAndRemove(req.params.id, function(err, doc) {
                if (err)
                    return next(err);
                if (!doc)
                    return res.send(404);

                res.send(204);
            });
        });
    });
};
