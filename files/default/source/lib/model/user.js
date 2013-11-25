/**
 * Model: User
 */
var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;
var Types = Schema.Types;

var User = new Schema({
    name : String,
    tenant : {
        type : Types.ObjectId,
        ref : "Tenant",
        required : true
    },
    groups : [{
        type : Types.ObjectId,
        ref : "Group"
    }]
});

// Users are unique within a tenant
User.index({
    name : 1,
    tenant : 1
}, {
    unique : true
});
User.path("groups").index(true);

module.exports = Mongoose.model("User", User);
