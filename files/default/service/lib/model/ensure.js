/**
 * Util: Ensure
 * 
 * Make sure a document exists in the DB
 */
var Truck = require("../util").truck;
var Model = module.exports = Truck.load(__dirname);

module.exports = function ensure(model, desc, query, params, callback) {
    if (typeof params === "function") {
        callback = params;
        params = query;
    }

    Model[model].findOne(query, function(err, doc) {
        if (err)
            callback(err);
        if (doc) {
            return callback(null, doc);
        }

        log.info("Creating new " + model + ": " + desc);
        doc = new Model[model](params);
        doc.save(function(err) {
            if (err)
                callback(err);

            callback(null, doc);
        });
    });
};
