/**
 * Model: Grant
 */
var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;
var Types = Schema.Types;
var Util = require("../util");
var Permission = require("./permission");

var PermissionProto = new Schema({
    resource : [ String ],
    actions : [ String ],
    effect : {
        type : String,
        enum : [ "Allow", "Deny" ],
        'default' : "Deny"
    }
});
PermissionProto.method("create", function(grantor, grant, grantee) {
    var p = new Permission(this.toObject());
    p.platform = grant.owner;
    p.service = grant.service;
    
    p.owner = grantor.tenant;
    p.applicant = grantee;
    return p;
});

var Grant = new Schema({
    name : {
        type : String,
        required : true,
        index : true
    },
    description : {
        type : String,
        required : true,
        index : true
    },
    owner : {
        type : Types.ObjectId,
        ref : "Tenant",
        required : true,
        index : true
    },
    service : {
        type : Types.ObjectId,
        ref : "Subject",
        required : true,
    },
    permissions : [ PermissionProto ],
    temp : {
        type : Boolean,
        'default' : false
    }
});

Grant.method("createPermissions", function(grantor, grantee) {
    var grant = this;
    return this.permissions.map(function(perm) {
        return perm.create(grantor, grantee, grant);
    });
});

//Indices
Grant.index({
    name : 1,
    owner : 1
}, {
    unique : true
});

Grant.set("autoIndex", false);
module.exports = Mongoose.model("Grant", Grant);
