/**
 * Control: Asset
 */
var FS = require("fs");
var MIME = require("mime");
var Path = require("path");

exports.route = function(app) {
    app.get(RegExp("/asset/(.+)"), function(req, res, next) {
        var path = req.params[0];
        path = Path.resolve(__dirname, "../../asset", path.replace(/\/\.\.?\/?/g, "/"));
        
        FS.stat(path, function(err, stats) {
            if((err && err.code === "ENOENT") || stats && stats.isDirectory()) // Not Found
                return res.send(404);
            if(err) // Unhandled Error
                return next(err);
            res.set("Content-Length", stats.size);
            res.set("Content-Type", MIME.lookup(path));
            FS.createReadStream(path).pipe(res);
        });
    });
};
