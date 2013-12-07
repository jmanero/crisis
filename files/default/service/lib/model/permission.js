/**
 * Model: Permission
 */
var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;
var Types = Schema.Types;

var Permission = new Schema({
    platform : {
        type : Types.ObjectId,
        ref : "Tenant",
        required : true,
    },
    service : {
        type : Types.ObjectId,
        ref : "Subject",
        required : true,
    },
    resource : [ String ],
    actions : [ String ],
    effect : {
        type : String,
        enum : [ "Allow", "Deny" ],
        'default' : "Deny"
    },
    owner : {
        type : Types.ObjectId,
        ref : "Tenant",
        required : true,
        index : true
    },
    applicant : {
        type : Types.ObjectId,
        ref : "Subject",
        required : true,
        index : true
    }
});

// Effect
Permission.virtual("allow").get(function() {
    return this.effect === "Allow";
});
Permission.virtual("deny").get(function() {
    return this.effect === "Deny";
});

// Validators
Permission.path("actions").validate(function(actions) {
    return !!actions.length;
}, "Permission must specify at lease one action");
Permission.path("resource").validate(function(resource) {
    return !!resource.length;
}, "Permission must specify a resource path or '*'");


// Indices
Permission.index({
    platform : 1,
    service : 1,
    resource : 1
});
Permission.index({
    platform : 1,
    service : 1,
    resource : 1,
    applicant : 1
});

Permission.set("autoIndex", false);
module.exports = Mongoose.model("Permission", Permission);
