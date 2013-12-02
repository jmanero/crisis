/**
 * Task: DBConfigure
 * 
 * Create root tenant, administrative policies and web service policies
 */
var Model = require("../model");
var Util = require("../util");

function ensure(model, desc, query, params, callback) {
    if (typeof params === "function") {
        callback = params;
        params = query;
    }
    
    Model[model].findOne(query, function(err, doc) {
        if (err)
            callback(err);
        if (doc) {
            return callback(null, doc);
        }

        log.info("Creating new " + model + ": " + desc);
        doc = new Model[model](params);
        doc.save(function(err) {
            if (err)
                callback(err);
            
            callback(null, doc);
        });
    });
};

function tenant(next) {
    ensure("tenant", "Default Tenant", {
        name : config.tenant
    }, function(err, tenant) {
        if (err)
            return next(err);
        config._tenant = tenant;
        next();
    });
}

function admin_group(next) {
    ensure("subject", "Service Administrators", {
        name : "Crisis-Administrator",
        tenant : config._tenant.id
    }, {
        name : "Crisis-Administrator",
        type : "Group",
        tenant : config._tenant
    }, function(err, subj) {
        if (err)
            return next(err);

        ensure("permission", "Service Adminsitrators Allow *", {
            platform : config.platform,
            service : config.service,
            resource : [ "*" ],
            applicant : subj.id
        }, {
            platform : config.platform,
            service : config.service,
            resource : [ "*" ],
            actions : [ "*" ],
            effect : "Allow",
            owner : config._tenant,
            applicant : subj
        }, next);
    });
}

function local_subject(next) {
    ensure("subject", "Local Subject", {
        name : config.subject,
        tenant : config._tenant.id
    }, {
        name : config.subject,
        tenant : config._tenant,
        type : "Asset"
    }, function(err, subj) {
        if (err)
            return next(err);
        config._subject = subj;
        next();
    });
}

function ui_group(next) {
    ensure("subject", "Service UI", {
        name : "Crisis-UI",
        tenant : config._tenant.id
    }, {
        name : "Crisis-UI",
        type : "Group",
        tenant : config._tenant
    }, function(err, subject) {
        if (err)
            return next(err);
        ui_perm_auth(subject, function(err) {
            if (err)
                return next(err);
            ui_perm_login(subject, next);
        });
    });
}

// UI permissions
function ui_perm_login(subject, next) {
    ensure("permission", "Servcie UI Allow Login", {
        platform : config.platform,
        service : config.service,
        resource : [ "subject", "*", "login" ],
        applicant : subject.id
    }, {
        platform : config.platform,
        service : config.service,
        resource : [ "subject", "*", "login" ],
        actions : [ "PUT" ],
        effect : "Allow",
        owner : config._tenant,
        applicant : subject
    }, next);
}

function ui_perm_auth(subject, next) {
    ensure("permission", "Service UI Allow Session Auth GET", {
        platform : config.platform,
        service : config.service,
        resource : [ "session", "*", "auth" ],
        applicant : subject.id
    }, {
        platform : config.platform,
        service : config.service,
        resource : [ "session", "*", "auth" ],
        actions : [ "GET" ],
        effect : "Allow",
        owner : config._tenant,
        applicant : subject
    }, next);
}

module.exports = function(next) {
    Util.train([ tenant, admin_group, local_subject, ui_group ], next);
};
