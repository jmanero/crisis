/**
 * Control: Subject
 */
var Model = require("../model");
var RESTify = require("restify");

module.exports = function(service) {
    // Validate an action
    service.post("/subject/:subject/can", function(req, res, next) {
        next(new RESTify.InternalError("Not Implemented"));
    });
    
    service.get("/subject/:subject/info", function(req, res, next) {
        Model.exists("subject", req.params.subject, function(err, subject) {
            if(err)
                return next(err);
            res.send({
                id : subject.id,
                type : subject.type,
                tenant : subject.tenant,
                links : subject.links
            });
        });
    });
};
