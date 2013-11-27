// Ripped off from 2012 Mark Cavage, Inc.  All rights reserved.
var crypto = require('crypto');
var zlib = require('zlib');
var assert = require('assert-plus');
var errors = require('restify').errors;

// /--- Globals
var BadDigestError = errors.BadDigestError;
var InvalidContentError = errors.InvalidContentError;
var RequestEntityTooLargeError = errors.RequestEntityTooLargeError;

var MD5_MSG = 'Content-MD5 \'%s\' didn\'t match \'%s\'';

// /--- Helpers
function createBodyWriter(req) {
    var contentType = req.contentType();
    if (!contentType || contentType === 'application/json' || contentType === 'application/x-www-form-urlencoded'
        || contentType === 'multipart/form-data' || contentType.substr(0, 5) === 'text/') {

        req.body = '';
        return (function(chunk) {
            req.body += chunk.toString('utf8');
        });
    }

    req.body = new Buffer(0);
    return (function(chunk) {
        req.body = Buffer.concat([ req.body, chunk ]);
    });
}

// /--- API
module.exports = function bodyReader(options) {
    options = options || {};
    assert.object(options, 'options');

    var maxBodySize = options.maxBodySize || 0;
    var contentHash = options.contentHash || false;


    // Digest for empty bodies
    var empties;
    if (contentHash) {
        empties = crypto.createHash(contentHash);
        empties.update("");
        empties = empties.digest("base64");
    }

    return (function readBody(req, res, next) {
        // No body in this request
        if ((req.getContentLength() === 0 && !req.isChunked()) || req.contentType() === 'multipart/form-data'
            || req.contentType() === 'application/octet-stream') {

            if (empties)
                req.digest = empties;
            
            return next();
        }

        function done() {
            if (maxBodySize && bytesReceived > maxBodySize) {
                var msg = 'Request body size exceeds ' + maxBodySize;
                next(new RequestEntityTooLargeError(msg));
                return;
            }

            if (hasher)
                req.digest = hasher.digest("base64");

            next();
        }

        var bytesReceived = 0;
        var hasher = contentHash ? crypto.createHash(contentHash) : false;
        var bodyWriter = createBodyWriter(req);

        var gz;
        if (req.headers['content-encoding'] === 'gzip') {
            gz = zlib.createGunzip();
            gz.on('data', function onData(chunk) {
                bodyWriter(chunk);
            });
            gz.once('end', done);
            req.once('end', gz.end.bind(gz));
        } else {
            req.once('end', done);
        }

        req.on('data', function onRequestData(chunk) {
            if (maxBodySize) {
                bytesReceived += chunk.length;
                if (bytesReceived > maxBodySize)
                    return;
            }

            if (hasher)
                hasher.update(chunk, 'binary');

            if (gz)
                return gz.write(chunk);
            bodyWriter(chunk);
        });

        req.once('error', next);
        req.resume();
    });
}
