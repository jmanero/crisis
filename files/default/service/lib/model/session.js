/**
 * Model: Session
 */
var Memcached = require("memcached");
var store = new Memcached(config.session);
function nothing() {};

var Session = module.exports = function(id) {
    Object.defineProperty(this, "id", {
        value : id,
        configurable : false,
        enumerable : false,
        writable : false
    });

    Object.defineProperty(this, "isNew", {
        value : true,
        enumerable : false,
        writable : true
    });

    this.expires = +(this.expires) || 3600000;
    this.data = this.data || {};
};

Session.get = function(id, options, callback) {
    if(typeof options === "function") {
        callback = options;
        options = {};
    }
    callback = typeof callback === "function" ? callback : nothing;
    options = options || {};
    
    store.get(id, function(e, session) {
        if (e)
            return callback(e);

        if (session) {
            try { // Instantiate Session object
                session = JSON.parse(session.toString("utf8"));
                Session.call(session, id);
                
                session.isNew = false;
                session.__proto__ = Session.prototype;
                
                if(options.expires)
                    session.expires = options.expires;

                return callback(null, session);
            } catch (e) {
                log.error(e);
            }
        }

        // Non-existent session or corrupted data
        session = new Session(id);
        if(options.expires)
            session.expires = options.expires;
        callback(null, session);
    });
};

Session.del = function(id, callback) {
    store.del(id, (typeof callback === "function" ? callback : nothing));
};

Session.prototype.touch = function(expires, callback) {
    if(typeof expires === "function")
        callback = expires;
    else if(+expires)
        this.expires = expires;
    
    this.touched = Date.now();
    store.touch(this.id, this.expires / 1000,
        (typeof callback === "function" ? callback : nothing));
};

Session.prototype.save = function(callback) {
    this.touched = Date.now();    
    store.set(this.id, JSON.stringify(this), this.expires / 1000,
        (typeof callback === "function" ? callback : nothing));
};
