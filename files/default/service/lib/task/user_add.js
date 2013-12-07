/**
 * Task: UserAdd
 */
var subjectAdd = require("./subject_add");
module.exports = function(user, callback) {
    user.type = "User";
    return subjectAdd(user, callback);
};
