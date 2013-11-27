/**
 * Model: Key
 */
var Crypto = require("crypto");
var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;
var Types = Schema.Types;

var Key = new Schema({
    secret : {
        type : String,
        required : true,
        'default' : function() {
            return Crypto.randomBytes(128).toString("base64");
        }
    },
    subject : {
        type : Types.ObjectId,
        ref : "Subject",
        required : true
    }
});

module.exports = Mongoose.model("Key", Key);
