#!/usr/bin/env node
/**
 * Identity Server
 */
var Mongoose = require("mongoose");
var RESTify = require("restify");
var Path = require("path");

Mongoose.connect("localhost/crisis");
var Entity = require("./lib/control/entity");
var Permission = require("./lib/control/permission");
var User = require("./lib/control/user");

var service = RESTify.createServer({
    name : "Crisis-Service",
});
service.log.level("info");

// Handlers
service.use(RESTify.acceptParser(service.acceptable));
service.use(RESTify.dateParser());
service.use(RESTify.queryParser());
service.use(RESTify.bodyParser({
    mapParams : false,
    rejectUnknown : true
}));
service.use(RESTify.requestLogger());

service.on('after', RESTify.auditLogger({
    log : service.log
}));

Entity.route(service);
Permission.route(service);
User.route(service);

// Start UI interface
service.listen(9090, function() {
    service.log.info("Listening for HTTP requests on port " + 9090);
});
