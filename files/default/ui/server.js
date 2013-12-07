//#!/usr/bin/env node
/**
 * Identity UI
 */
var Express = require("express");
var Path = require("path");
var Util = require("./lib/util");
var Control = require("./lib/control");
var MW = require("./lib/mw");

var app = Express(); // HTTP Router
app.engine("html", require("ejs").renderFile);
app.set("views", Path.join(__dirname, "template"));

// Handlers
app.use(Express.cookieParser());
app.use(MW.session({
    service : $config.session
    
}));
app.use(Express.favicon());
app.use(Express.logger());
app.use(function(req, res, next) {
    res.locals.req = req;
    next();
});
app.use(app.router);
app.use(NotFound.controller());

// Install Controllers
Control.each(function(controller, name) {
    service.log.info("Loaded controller " + name);
    controller(service);
});

//Start Service Interface
function serviceListen(next) {
    app.listen($config.listen, function() {
        service.log.info("Listening for HTTP requests on port " + $config.listen);
        next();
    });
}

// Startup Sequence
Util.train([ serviceListen ], function(err) {
    if (err)
        return console.log(err);
    $log.info("Service Ready");
});
