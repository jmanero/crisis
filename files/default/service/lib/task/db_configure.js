/**
 * Task: DBConfigure
 * 
 * Create root tenant, administrative policies and web service policies
 */
var Model = require("../model");
var Util = require("../util");

function ensure(model, query, params, callback) {
    if (typeof params === "function") {
        callback = params;
        params = query;
    }
    
    console.log(model);
    console.log(Util.inspect(query, { depth : null }));

    Model[model].findOne(query, function(err, doc) {
        if (err)
            callback(err);
        if (doc) {
            console.log("Found: " + Util.inspect(query, { depth : null }));
            return callback(null, doc);
        }

        log.info("Creating new " + model, params);
        doc = new Model[model](params);
        doc.save(function(err) {
            if (err)
                callback(err);
            callback(null, doc);
        });
    });
};

function tenant(next) {
    ensure("tenant", {
        name : config.tenant
    }, function(err, tenant) {
        if (err)
            return next(err);
        config._tenant = tenant;
        next();
    });
}

function admin_group(next) {
    ensure("subject", {
        name : "Crisis-Administrator",
        tenant : config._tenant
    }, {
        name : "Crisis-Administrator",
        type : "Group",
        tenant : config._tenant
    }, function(err, subj) {
        if (err)
            return next(err);

        ensure("permission", {
            platform : config.platform,
            service : config.service,
            resource : [ "*" ],
            applicant : subj
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
    ensure("subject", {
        name : config.subject,
        tenant : config._tenant
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
    ensure("subject", {
        name : "Crisis-UI",
        tenant : config._tenant
    }, {
        name : "Crisis-UI",
        type : "Group",
        tenant : config._tenant
    }, function(err, subj) {
        if (err)
            return next(err);

//        Util.bus(function(query, params, next) {
//            ensure("permission", query, params, next);
//        }, [ [ {
//            platform : config.platform,
//            service : config.service,
//            resource : [ "subject", "*", "login" ],
//            applicant : subj
//        }, {
//            platform : config.platform,
//            service : config.service,
//            resource : [ "subject", "*", "login" ],
//            actions : [ "PUT" ],
//            effect : "Allow",
//            owner : config._tenant,
//            applicant : subj
//        } ], [ {
//            platform : config.platform,
//            service : config.service,
//            resource : [ "session", "*", "data" ],
//            applicant : subj
//        }, {
//            platform : config.platform,
//            service : config.service,
//            resource : [ "session", "*", "data" ],
//            actions : [ "GET", "PUT"  ],
//            effect : "Allow",
//            owner : config._tenant,
//            applicant : subj
//        } ] ], next);
    });
}

module.exports = function(next) {
    Util.train([ tenant, admin_group, local_subject, ui_group ], next);
};
