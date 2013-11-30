/**
 * Util: Bus
 */
module.exports = function bus(work, tasks, done) {
    tasks = tasks.clone();
    var count = tasks.length;
    
    tasks.each(function(task) {
        task.push(function() {
            count--;
            
            if(!count)
                done();
        });
        process.nextTick(function() {
            work.apply({}, task);
        });
    });
};
