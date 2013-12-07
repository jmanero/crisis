/**
 * Model: Ensure
 * 
 * Make sure a document exists in the DB. Create if missing
 */
var Model = require("../util").truck.load(__dirname);

module.exports = function ensure(model, desc, query, params, callback) {
    if (typeof params === "function") {
        callback = params;
        params = query;
    }

    Model[model].findOne(query, function(err, doc) {
        if (err)
            return callback(err);
        if (doc) {
            return callback(null, doc);
        }

        $log.info("Creating new " + model + ": " + desc);
        doc = new Model[model](params);
        doc.save(function(err) {
            if (err)
                return callback(err);
            callback(null, doc);
        });
    });
};
