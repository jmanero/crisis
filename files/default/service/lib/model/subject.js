/**
 * Model: Subject
 */
var Crypto = require("crypto");
var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;
var Types = Schema.Types;
var Util = require("../util");

var Link = new Schema({
    rel : {
        type : String,
        index : true
    },
    href : String
});

var Subject = new Schema({
    name : {
        type : String,
        required : true
    },
    type : {
        type : String,
        enum : [ "User", "Asset", "Group" ],
        required : true
    },
    tenant : {
        type : Types.ObjectId,
        ref : "Tenant",
        required : true
    },
    inherits : [ {
        type : Types.ObjectId,
        ref : "Subject"
    } ],
    _policy : Types.Mixed,
    links : [ Link ],
    _password : {
        hash : Buffer,
        salt : Buffer,
        algorithm : {
            type : String,
            enum : [ "sha256" ]
        }
    }
});

// Password Crypto
Subject.virtual("password").set(function(password) {
    var salt = Crypto.randomBytes(64);
    var hasher = Crypto.createHash("sha256");

    hasher.update(salt);
    hasher.update(password);

    this._password = {
        salt : salt,
        hash : hasher.digest(),
        algorithm : "sha256"
    };
});

Subject.method("login", function(password) {
    var password = this._password;
    var hasher = Crypto.createHash(password.algorithm);

    hasher.update(password.salt);
    hasher.update(password);

    return password.hash.toString("base64") == hasher.digest("base64");
});

// Traverse Inheritance Tree
Subject.method("inherit", function(iter, callback) {
    if (typeof iter !== "function" || typeof callback !== "function")
        return;

    // Recurse through this Subject's inheritance tree
    var loaded = {};
    (function loader(nodes) {
        var node = nodes.shift();
        if (!node)
            return callback(null, loaded);

        // Loop buster
        if (loaded.key(node._id))
            return loader(nodes);
        loaded[node._id] = loaded.count();

        // Get node's parents
        node.populate("inherits", function(err, node) {
            if (err)
                return callback(err);

            Array.prototype.push.apply(nodes, node.inherits);
            iter(node, function(err) {
                if (err)
                    return callback(err);
                loader(nodes);
            });
        });
    })([ this ]);
});

Subject.method("permissions", function(query, callback) {
    if (typeof callback !== "function")
        return;

    var permissions = [];
    var query = query || {};
    
    function iter(node, next) {
        Permission.find(query.merge({
            applicant : node._id
        }), function(err, perms) {
            if (err)
                return next(err);

            Array.prototype.push.apply(permissions, perms);
            next();
        });
    }

    this.inherit(iter, function(err, ancestors) {
        callback(err, new Util.turnstyle(permissions), ancestors);
    });
});

Subject.method("policy", function(callback) {
    if (typeof callback !== "function")
        return;

    var policy = {};
    this.inherit(function(node, next) {
        policy.$merge(node._policy);
        next();
    }, function(err, ancestors) {
        callback(err, policy, ancestors);
    });
});

// Validators
Subject.pre("validate", function(next) {
    // Only users can have passwords
    if (this.type !== "User")
        delete this._password;

    next();
});

// Indices
Subject.index({
    name : 1,
    tenant : 1
}, {
    unique : true
});
Subject.path("inherits").index(true);

Subject.set("autoIndex", false);
module.exports = Mongoose.model("Subject", Subject);
var Permission = require("./permission");
