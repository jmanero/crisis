#!/usr/bin/env node
/**
 * Test: Permissions
 */
var Mongoose = require("mongoose");
var Subject = require("../lib/model/subject");

Mongoose.connect("localhost/crisis");
Mongoose.connection.on("connected", function() {
   console.log("Connected to MongoDB localhost/crisis");
});

Subject.findOne({
    name : "web-ui"
}, function(err, user) {
    user.permissions(function(err, perms, ans) {
        if(err)
            console.log(err);
        
        console.log("Permissions ---");
        console.log(perms);
        console.log("Ancestors -----");
        console.log(ans);
    });
});
