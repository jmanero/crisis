/**
 * Util: Train
 * 
 * Sequence Controller
 */
module.exports = function(tasks, callback) {
    tasks = tasks.clone();
    (function looper(res) {
        if(!tasks.length) // Complete
            return callback(null, res);
        
        tasks.next(function(err, res) {
            if(err)
                return callback(err);
            looper(res);
        }, res);
    })();
};
