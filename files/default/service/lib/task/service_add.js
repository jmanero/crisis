/**
 * Task: ServiceAdd
 */
var subjectAdd = require("./subject_add");
module.exports = function(service, callback) {
    service.type = "Service";
    return subjectAdd(service, callback);
};
