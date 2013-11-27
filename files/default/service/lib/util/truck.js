/**
 * Util: Truck
 */
var FS = require("fs");
var Path = require("path");

var humps = /_(.)/g;

exports.load = function(dir) {
    var mods = {};
    FS.readdirSync(dir).forEach(function(mod) {
        var mpath = Path.join(dir, mod);
        mod = Path.basename(mod, ".js");

        // Skip index.js
        if (mod === "index")
            return;

        // No Directories
        if (FS.statSync(mpath).isDirectory())
            return;

        // CamelCase Name
        mod = mod.replace(humps, function(match, capture) {
            return capture.toUpperCase();
        });

        // Load it
        mods[mod] = require(mpath);
    });

    return mods;
};
