/**
 * Model: Session
 */
var Crypto = require("crypto");
var Cache = require("./cache");
var Util = require("../util");

function nothing() {};
function something(callback) {
    return typeof callback === "function" ? callback : nothing;
}

function key(client, id) {
    return "Session::" + client + "::" + id;
}

var Session = module.exports = function(client, id) {
    this.id = id || Crypto.randomBytes(32).toString("hex");
    this.owner = this.owner || client;
    if (!(this instanceof Cache)) {
        Cache.call(this, key(client, this.id));
    }

    this.children = this.children || [];
    this.data = this.data || {};
    this.permissions = this.permissions || [];
    this.token = this.token || Crypto.randomBytes(96).toString("base64");
    this.type = this.type || "preauth";
};

Session.get = function(client, id, callback) {
    callback = something(callback);
    Cache.get(key(client, id), function(err, cache) {
        if (err)
            return callback(err);
        if (!cache)
            return callback();

        callback(null, Session.call(cache, client, id));
    });
};

Session.del = function(client, id, callback) {
    Cache.del(key(client, id), callback);
};
