/**
 * Model: Permission
 */
var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;
var Types = Schema.Types;

var Permission = new Schema({
    platform : String,
    service : String,
    resource : [ String ],
    action : [ String ],
    effect : {
        type : String,
        enum : [ "Allow", "Deny" ],
        'default' : "Deny"
    },
    tenant : {
        type : Types.ObjectId,
        ref : "Tenant",
        required : true
    },
    subject : Types.ObjectId
});

Permission.index({
    platform : 1,
    service : 1,
    resource : 1
});
Permission.index({
    subject : 1,
    tenant : 1
});

module.exports = Mongoose.model("Permission", Permission);
