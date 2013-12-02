/**
 * Task: DBConfigure
 * 
 * Create root tenant, administrative policies and web service policies
 */
var Model = require("../model");
var Util = require("../util");

module.exports = function(_config) {
    // Override global config
    config = config.merge(_config || {});
    
    function tenant(next) {
        Model.ensure("tenant", "Default Tenant", {
            name : config.tenant
        }, function(err, tenant) {
            if (err)
                return next(err);
            cluster.tenant = tenant;
            next();
        });
    }

    function admin_group(next) {
        Model.ensure("subject", "Service Administrators", {
            name : "Crisis-Administrator",
            tenant : cluster.tenant.id
        }, {
            name : "Crisis-Administrator",
            type : "Group",
            tenant : cluster.tenant
        }, function(err, admins) {
            if (err)
                return next(err);

            cluster.admins = admins;
            Model.ensure("permission", "Service Adminsitrators Allow *", {
                platform : config.platform,
                service : config.service,
                resource : [ "*" ],
                applicant : admins.id
            }, {
                platform : config.platform,
                service : config.service,
                resource : [ "*" ],
                actions : [ "*" ],
                effect : "Allow",
                owner : cluster.tenant,
                applicant : admins
            }, next);
        });
    }

    function local_subject(next) {
        Model.ensure("subject", "Local Subject", {
            name : config.subject,
            tenant : cluster.tenant.id
        }, {
            name : config.subject,
            tenant : cluster.tenant,
            type : "Asset"
        }, function(err, subject) {
            if (err)
                return next(err);
            cluster.subject = subject;
            next();
        });
    }

    function ui_group(next) {
        Model.ensure("subject", "Service UI", {
            name : "Crisis-UI",
            tenant : cluster.tenant.id
        }, {
            name : "Crisis-UI",
            type : "Group",
            tenant : cluster.tenant
        }, function(err, uis) {
            if (err)
                return next(err);
            cluster.uis = uis;
            next();
        });
    }

    // UI permissions
    function ui_perm_login(next) {
        Model.ensure("permission", "Servcie UI Allow Login", {
            platform : config.platform,
            service : config.service,
            resource : [ "subject", "*", "login" ],
            applicant : cluster.uis.id
        }, {
            platform : config.platform,
            service : config.service,
            resource : [ "subject", "*", "login" ],
            actions : [ "PUT" ],
            effect : "Allow",
            owner : cluster.tenant,
            applicant : cluster.uis
        }, next);
    }

    function ui_perm_sessionauth(next) {
        Model.ensure("permission", "Service UI Allow Session Auth GET", {
            platform : config.platform,
            service : config.service,
            resource : [ "session", "*", "auth" ],
            applicant : cluster.uis.id
        }, {
            platform : config.platform,
            service : config.service,
            resource : [ "session", "*", "auth" ],
            actions : [ "GET" ],
            effect : "Allow",
            owner : cluster.tenant,
            applicant : cluster.uis
        }, next);
    }

    return function(next) {
        Util.train([ tenant, admin_group, local_subject, ui_group, ui_perm_sessionauth, ui_perm_login ], next);
    };
};
