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
        required : true,
        index : true
    },
    type : {
        type : String,
        enum : [ "User", "Domain", "Service", "Group" ],
        required : true,
        index : true
    },
    tenant : {
        type : Types.ObjectId,
        ref : "Tenant",
        required : true,
        index : true
    },
    inherits : [ {
        type : Types.ObjectId,
        ref : "Subject"
    } ],
    grant : {
        type : Types.ObjectId,
        ref : "Grant"
    },
    grantor : {
        type : Types.ObjectId,
        ref : "Subject"
    },
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
    hasher.update(password.toString());

    this._password = {
        salt : salt,
        hash : hasher.digest(),
        algorithm : "sha256"
    };
});

Subject.method("signin", function(password) {
    var password = this._password;
    var hasher = Crypto.createHash(password.algorithm);

    hasher.update(password.salt);
    hasher.update(password);

    return password.hash.toString("base64") == hasher.digest("base64");
});

// Traverse Inheritance Tree
Subject.method("ancestors", function(iter, callback) {
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
        node.populate({
            path : "inherits",
            match : {
                type : {
                    $in : [ "Service", "Group" ]
                }
            }
        }, function(err, node) {
            if (err)
                return callback(err);
            Array.prototype.push.apply(nodes, node.inherits);
            
            // Yield the node
            iter(node, function(err) {
                if (err)
                    return callback(err);
                loader(nodes);
            });
        });
    })([ this ]);
});
Subject.method("descendants", function(iter, callback) {
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
        
        // Yield the node
        iter(node, function(err) {
            if (err)
                return callback(err);
            
            // Get node's children
            Subject.find({
                inherits : node._id
            }, function(err, children) {
                if (err)
                    return callback(err);

                Array.prototype.push.apply(nodes, children);
                loader(nodes);
            });
        });
    })([ this ]);
});

Subject.method("permissions", function(query, callback) {
    if (typeof callback !== "function")
        return;

    var subject = this;
    var permissions = [];
    var query = query || {};

    function iter(node, next) {
        // Get permissions referenced by a Grant
        if (node.type === "Grant") {
            return node.populate("permissions", function(err, node) {
                if (err)
                    return callback(err);

                Array.prototype.push.apply(permissions, perms);
                next();
            });
        }

        // Get permissions that apply to a Group/Service
        Permission.find(query.merge({
            applicant : node._id
        }), function(err, perms) {
            if (err)
                return next(err);

            Array.prototype.push.apply(permissions, perms);
            next();
        });
    }

    this.ancestors(iter, function(err, ancestors) {
        callback(err, new Util.turnstyle(permissions, subject.toObject()), ancestors);
    });
});

Subject.method("policy", function(callback) {
    if (typeof callback !== "function")
        return;

    var policy = {};
    this.ancestors(function(node, next) {
        // Don't inherit policy from Grants
        if (node.type === "Grant")
            return next()

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

    // Only Groups can reference Grants
    if (this.type !== "Group") {
        delete this.grant;
        delete this.grantor;
    }

    next();
});

// Indices
Subject.index({
    name : 1,
    tenant : 1
}, {
    unique : true
});
Subject.index({
    tenant : 1,
    type : 1
});
Subject.index({
    tenant : 1,
    grant : 1
}, {
    sparse : true
});
Subject.path("inherits").index(true);

Subject.set("autoIndex", false);
module.exports = Mongoose.model("Subject", Subject);
var Permission = require("./permission");
