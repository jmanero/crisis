/**
 * Model: Key
 */
var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;
var Types = Schema.Types;

var Key = new Schema({
    secret : String
});

module.exports = Mongoose.model("Key", Key);
