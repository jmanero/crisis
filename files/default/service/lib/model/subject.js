/**
 * Model: Subject
 */
var Crypto = require("crypto");
var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;
var Types = Schema.Types;

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
    policy : Types.Mixed,
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
    var hasher = Crypto.createHash(this._password.algorithm);
    
    hasher.update(this._password.salt);
    hasher.update(password);
    
    return this._password.hash.toString("base64") == hasher.digest("base64");
});

// Build inherited permission list
Subject.method("permissions", function(callback) {
    if(typeof callback !== "function")
        return;
    
    var found = {};
    var permissions = [];
    
    this.inherits.each(function(parent) {
        // Loop Busting
        if(found[parent._id])
            return;
        found[parent._id] = true;
        
        
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
