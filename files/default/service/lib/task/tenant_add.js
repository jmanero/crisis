/**
 * Task: UserAdd
 */
var Model = require("../model");
var Util = require("../util");

module.exports = function(tenant, callback) {
    function task(next, _tenant) {
        _tenant = _tenant || tenant;
        Model.ensure("tenant", "Tenant " + _tenant.name, _tenant, next);
    };
    
    if(typeof callback === "function")
        task(callback);
    return task;
};
