/**
 * Model: Exists
 * 
 * Make sure a document exists in the DB
 */
var Model = require("../util").truck.load(__dirname);
var ObjectId = require("mongoose").Types.ObjectId;
var ResourceNotFoundError = require("restify").ResourceNotFoundError;

function query(entity) {
    if(entity instanceof ObjectId)
        return ({
            _id : entity
        });
    
    if (typeof entity === "object") {
        if(entity._id instanceof ObjectId)
            return ({
                _id : entity._id
            });
        
        try {
            return ({
                _id : new ObjectId(entity._id)
            });
        } catch (e) {
        }
        
        if(entity.name)
            return ({
                name : entity.name
            });
        
        throw new TypeError("Unable to cast query!");
    }
    
    try {
        return ({
            _id : new ObjectId(entity)
        });
    } catch (e) {
    }
    
    return ({
        name : entity
    });
}

module.exports = function exists(model, entity, callback) {
    if(entity instanceof Model[model])
        return callback(null, entity);
    
    Model[model].findOne(query(entity), function(err, doc) {
        if (err)
            return callback(err);
        if (!doc)
            return callback(new ResourceNotFoundError(model + " " + (entity._id || entity) + " does not exist"));
        callback(null, doc);
    });
};
