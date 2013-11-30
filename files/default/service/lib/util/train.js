/**
 * Util: Train
 * 
 * Sequence Controller
 */
module.exports = function(tasks, callback) {
    tasks = tasks.clone();
    (function looper() {
        if(!tasks.length) // Complete
            return callback(null);
        
        tasks.next(function(err, res) {
            if(err)
                return callback(err);
            looper();
        });
    })();
};
