#!/usr/bin/env node
/**
 * Identity Server
 */
var Mongoose = require("mongoose");
var Path = require("path");
var RESTify = require("restify");

var MW = require("./lib/mw");

// REST API Service
var service = RESTify.createServer({
    name : "Crisis-Service",
});
service.log.level("info");

// MongoDB (PoC) Store
Mongoose.connect("localhost/crisis");
Mongoose.connection.on("connected", function() {
    service.log.info("Connected to MongoDB localhost/crisis");
});

// Request Handlers
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

// Controllers
require("./lib/control").each(function(controller, name) {
    service.log.info("Loaded controller " + name);
    controller(service);
});

// Start UI interface
service.listen(9090, function() {
    service.log.info("Listening for HTTP requests on port " + 9090);
});
