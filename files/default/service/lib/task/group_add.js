/**
 * Task: GroupAdd
 */
var subjectAdd = require("./subject_add");
module.exports = function(group, callback) {
    group.type = "Group";
    return subjectAdd(group, callback);
};
