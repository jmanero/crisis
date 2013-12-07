/**
 * Task: KeyAdd
 */
var Model = require("../model");

module.exports = function(subject, callback) {
    function task(next, _subject) {
        _subject = _subject || subject;
        Model.exists("subject", _subject, function(err, subject) {
            if (err)
                return next(err);

            var key = new Model.key({
                subject : subject
            });

            key.save(function(err) {
                next(err, key);
            });
        });
    }
    
    if (typeof callback === "function")
        task(callback);
    return task;
};
