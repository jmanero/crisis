#!/usr/bin/env node
/**
 * Tool: Bootstrap
 * 
 * Create root tenant, administrative policies and web service policies
 */
var Tenant = require("../lib/model/tenant");
var Permission = require("../lib/model/permission");
var Subject = require("../lib/model/subject");

var Mongoose = require("mongoose");
Mongoose.connect("localhost/crisis");

var docs = [];

// Default Tenant
var tenant = new Tenant({
    name : "_default"
});
docs.push(tenant);

// Groups
var admin = new Subject({
    name : "Administrator",
    type : "Group",
    tenant : tenant
});
docs.push(admin);
var webui = new Subject({
    name : "Web",
    type : "Group",
    tenant : tenant
});
docs.push(webui);

// Default Users
docs.push(new Subject({
    name : process.argv[2],
    type : "User",
    tenant : tenant,
    password : process.argv[3],
    inherits : [ admin ]
}));

docs.push(new Subject({
    name : "web-ui",
    type : "Asset",
    tenant : tenant,
    inherits : [ webui ]
}));

// Administrators can do anything to the ID service
docs.push(new Permission({
    platform : "_default",
    service : "identity",
    resource : [ "*" ],
    actions : [ "*" ],
    effect : "Allow",
    tenant : tenant,
    applicant : {
        tenant : tenant,
        subject : admin
    }
}));

// The web UI can log users in
docs.push(new Permission({
    platform : "_default",
    service : "identity",
    resource : [ "subject", "*", "login" ],
    actions : [ "PUT" ],
    effect : "Allow",
    tenant : tenant,
    applicant : {
        tenant : tenant,
        subject : webui
    }
}));

// The web UI can read and munge session data
docs.push(new Permission({
    platform : "_default",
    service : "session",
    resource : [ "session", "*", "data" ],
    actions : [ "GET", "PUT" ],
    effect : "Allow",
    tenant : tenant,
    applicant : {
        tenant : tenant,
        subject : webui
    }
}));

function services() {
    
}

function looper(docs) {
    if (!docs.length) {
        console.log("√ Complete!");
        return Mongoose.disconnect();
    }

    var doc = docs.shift();
    console.log("+ Saving " + doc.constructor.modelName + " " + doc.name);
    doc.save(function(err) {
        if (err) {
            console.log("x Error saving " + doc.constructor.modelName);
            return console.log(err);
        }

        console.log("√ Saved! ID " + doc._id);
        looper(docs);
    });
}

(function indexer(models) {
    if (!models.length) {
        console.log("√ Indexing Complete!");
        return looper(docs)
    }

    var model = models.shift();
    console.log("+ Creating indexes for " + model.modelName);
    model.ensureIndexes(function(err) {
        if (err) {
            console.log("x Error indexing " + model.modelName);
            return console.log(err);
        }
        console.log("√ Done!");
        indexer(models);
    });
})([ Tenant, Subject, Permission ]);
