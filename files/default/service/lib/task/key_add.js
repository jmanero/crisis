/**
 * Task: KeyAdd
 */
var Model = require("../model");

module.exports = function(key) {
    return function(next, _key) {
        key = key.merge(_key || {});
        
        Model.subject.findOne({
            name : key.user
        }, function(err, user) {
            if (err)
                return next(err);
            if (!user)
                return next(new ReferenceError("User " + key.user + " does not exist!"));

            var k = Model.key({
                subject : user
            });

            k.save(function(err) {
                next(err, k);
            });
        });
    };
};
