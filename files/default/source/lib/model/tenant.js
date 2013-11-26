/**
 * Model: Tenant
 */
var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;
var Types = Schema.Types;

var Tenant = new Schema({
    name : {
        type : String,
        unique : true,
        required : true
    }
});

Tenant.set("autoIndex", false);
module.exports = Mongoose.model("Tenant", Tenant);
