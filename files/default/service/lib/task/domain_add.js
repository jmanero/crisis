/**
 * Task: DomainAdd
 */
var subjectAdd = require("./subject_add");
module.exports = function(domain, callback) {
    domain.type = "Domain";
    return subjectAdd(domain, callback);
};
