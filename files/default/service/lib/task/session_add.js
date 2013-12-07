/**
 * Task: SessionSet
 */
var Model = require("../model");
var Util = require("../util");

module.exports = function(service, data, callback) {
    function task(next, data) {
        Model.exists("subject", service, function(err, service) {
            if(err)
                return next(err);
            
            var session = new Model.session(service);
            session.data = data || {};
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
