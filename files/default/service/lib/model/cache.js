/**
 * Model: Cache
 */
var Memcached = require("memcached");
var Util = require("../util");

var store = new Memcached($config.cache);

function nothing() {};
function something(callback) {
    return typeof callback === "function" ? callback : nothing;
}

var Cache = module.exports = function(id, cas) {
    Object.defineProperty(this, "_id", {
        value : id,
        configurable : false,
        enumerable : false,
        writable : false
    });
    Object.defineProperty(this, "cas", {
        value : cas,
        configurable : false,
        enumerable : false,
        writable : true
    });

    Object.defineProperty(this, "isNew", {
        value : true,
        enumerable : false,
        writable : true
    });

    this.expires = +(this.expires) || 3600;
};

Cache.get = function(id, callback) {
    callback = something(callback);
    store.gets(id, function(err, doc) {
        if (err)
            return callback(err);

        if (!doc)
            return callback();

        try {
            // Instantiate Cache object
            doc = JSON.parse(doc.toString("utf8"));
            Cache.call(doc[id], id, doc.cas);
            doc.isNew = false;
            doc.__proto__ = Cache.prototype;

            return callback(null, doc);
        } catch (err) {
            return callback(err);
        }
    });
};

Cache.del = function(id, callback) {
    store.del(id, something(callback));
};

Cache.prototype.refresh = function(callback) {
    callback = something(callback);
    if(this.isNew) // Nothing to get
        return callback();
    
    store.gets(id, function(err, doc) {
        if (err)
            return callback(err);

        if (!doc) // No doc in cache
            return callback(null, false);

        try {
            // Update CAS and merge in new doc
            this.cas = doc.cas;
            this.$merge(JSON.parse(doc[this._id]));
            
            return callback(null, true);
        } catch (err) {
            return callback(err);
        }
    });
};

Cache.prototype.touch = function(expires, callback) {
    if (typeof expires === "function") {
        callback = expires;
        expires = undefined;
    }

    if (+expires)
        this.expires = expires;

    store.touch(this._id, this.expires, something(callback));
};

Cache.prototype.save = function(callback) {
    if(this.isNew) {
        store.set(this._id, JSON.stringify(this), this.expires, function(err) {
            if (err)
                return callback(err);
            
            this.isNew = false;
            return this.refresh(something(callback)); // Get CAS
        });
    }
        
    store.cas(this._id, JSON.stringify(this), this.cas, this.expires, function(err) {
        this.refresh(something(callback)); // Get CAS
    });
};

Cache.prototype.del = function(callback) {
    store.del(this._id, something(callback));
};

