/**
 * Task: UserAdd
 */
var Model = require("../model");

module.exports = function(user) {
    return function(next, _user) {
        user = user.merge(_user || {});

        Model.ensure("subject", "User " + user.name, {
            name : user.name,
            tenant : cluster.tenant
        }, {
            name : user.name,
            password : user.password,
            tenant : cluster.tenant,
            type : "User",
            inherits : user.inherits
        }, next);
    };
};
