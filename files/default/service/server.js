#!/usr/bin/env node
/**
 * Identity Server
 */
var Path = require("path");
var RESTify = require("restify");
var Util = require("./lib/util");
var Control = require("./lib/control");
var MW = require("./lib/mw");
var Task = require("./lib/task");

// REST API Service
var service = RESTify.createServer({
    name : "Crisis-Service",
    log : $log.child({
        process : "Service"
    })
});

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
    log : $log.child({
        process : "Requests"
    })
}));

// Install Controllers
Control.each(function(controller, name) {
    service.log.info("Loaded controller " + name);
    controller(service);
});

// Start Service Interface
function serviceListen(next) {
    service.listen($config.listen, function() {
        service.log.info("Listening for HTTP requests on port " + $config.listen);
        next();
    });
}

// Startup Sequence
Util.train([ Task.dbConnect(), Task.serviceConfigure(), Task.instanceConfigure(), serviceListen ], function(err) {
    if (err)
        return $log.error(err);
    $log.info("Service Ready");
});
