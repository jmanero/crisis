#!/usr/bin/env node
/**
 * Identity Server
 */
var Path = require("path");
var RESTify = require("restify");
var Util = require("./lib/util");

// REST API Service
var service = RESTify.createServer({
    name : "Crisis-Service",
});
service.log.level("info");

global.config = require("./config.default");
global.config.$merge(require("./config"));
global.log = service.log;

var Control = require("./lib/control");
var MW = require("./lib/mw");
var Task = require("./lib/task");

// Install Request Handlers
service.use(RESTify.acceptParser(service.acceptable));
service.use(RESTify.dateParser());
service.use(RESTify.queryParser());
service.use(MW.bodyReader({
    contentHash : "sha1"
}));
service.use(MW.bodyParser({
    mapParams : false,
    rejectUnknown : true
}));
service.use(RESTify.requestLogger());
service.use(MW.authenticate());
service.use(MW.authorize());

service.on('after', RESTify.auditLogger({
    log : service.log
}));

// Install Controllers
Control.each(function(controller, name) {
    service.log.info("Loaded controller " + name);
    controller(service);
});

// Start Service Interface
function serviceListen(next) {
    service.listen(config.listen, function() {
        service.log.info("Listening for HTTP requests on port " + config.listen);
        next();
    });
}

// Startup Sequence
Util.train([ Task.dbConnect, Task.dbConfigure, serviceListen ], function(err) {
    if (err)
        return console.log(err);
    log.info("Service Ready");
});
