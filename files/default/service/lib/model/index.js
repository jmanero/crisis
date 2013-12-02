/**
 * MiddleWare
 */
var Truck = require("../util").truck;
var Model = module.exports = Truck.load(__dirname);

Model.entities = [ "key", "permission", "subject", "tenant" ];
