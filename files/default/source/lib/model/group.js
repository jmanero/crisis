/**
 * Model: Group
 */
var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;
var Types = Schema.Types;

var Group = new Schema({
    name : {
        type : String,
        unique : true
    },
    tenant : {
        type : Types.ObjectId,
        ref : "Tenant",
        required : true
    }
});

//Users are unique within a tenant
Group.index({
    name : 1,
    tenant : 1
}, {
    unique : true
});

module.exports = Mongoose.model("Group", Group);
