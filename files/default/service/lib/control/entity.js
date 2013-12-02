/**
 * Control: Entity
 * 
 * Resource accessors for the internal model
 */
var Path = require("path");
var Model = require("../model");

module.exports = function(service) {
    Model.entities.each(function(model, name) {
        service.post("/" + name, function(req, res, next) {
            (new model(req.body)).save(function(err) {
                if (err)
                    return next(err);

                res.link("self", Path.join("/", name, this._id));
                res.send(201);
            });
        });

        service.get(Path.join("/", name, ":id"), function(req, res, next) {
            model.findById(req.params.id, function(err, doc) {
                if (err)
                    return next(err);
                if (!doc)
                    return res.send(404);

                res.send(doc);
            });
        });
        service.put(Path.join("/", name, ":id"), function(req, res, next) {
            model.findById(req.params.id, function(err, doc) {
                if (err)
                    return next(err);
                if (!doc)
                    return res.send(404);

                doc.$merge(req.body);
                doc.save(function(err) {
                    if (err)
                        return next(err);

                    res.send(doc);
                });
            });
        });
        service.del(Path.join("/", name, ":id"), function(req, res, next) {
            model.findByIdAndRemove(req.params.id, function(err, doc) {
                if (err)
                    return next(err);
                if (!doc)
                    return res.send(404);

                res.send(204);
            });
        });
    });
};
