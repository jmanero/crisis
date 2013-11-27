// Ripped off from 2012 Mark Cavage, Inc.  All rights reserved.

/**
 * MiddleWare: BodyParser
 */
var RESTify = require("restify");
var assert = require('assert-plus');

var errors = RESTify.errors;
var jsonParser = RESTify.jsonBodyParser;
var formParser = RESTify.urlEncodedBodyParser;
var multipartParser = RESTify.multipartBodyParser;
var fieldedTextParser = require('./fielded_text_body_parser.js');

// /--- Globals
var UnsupportedMediaTypeError = errors.UnsupportedMediaTypeError;

// /--- API
module.exports = function bodyParser(options) {
    assert.optionalObject(options, 'options');
    options = options || {};
    options.bodyReader = true;

    var parseForm = formParser(options);
    var parseJson = jsonParser(options);
    var parseMultipart = multipartParser(options);
    var parseFieldedText = fieldedTextParser(options);

    return (function parseBody(req, res, next) {
        // Allow use of 'requestBodyOnGet' flag to allow for merging of
        // the request body of a GET request into req.params
        if (req.method === 'HEAD') {
            next();
            return;
        }
        if (req.method === 'GET') {
            if (!options.requestBodyOnGet) {
                next();
                return;
            }
        }

        if (req.contentLength() === 0 && !req.isChunked()) {
            next();
            return;
        }

        var parser;
        var type = req.contentType();
        switch (type) {
        case 'application/json':
            parser = parseJson[0];
            break;
        case 'application/x-www-form-urlencoded':
            parser = parseForm[0];
            break;
        case 'multipart/form-data':
            parser = parseMultipart;
            break;
        case 'text/tsv':
            parser = parseFieldedText;
            break;
        case 'text/tab-separated-values':
            parser = parseFieldedText;
            break;
        case 'text/csv':
            parser = parseFieldedText;
            break;

        default:
            break;
        }

        if (parser) {
            parser(req, res, next);
        } else if (options && options.rejectUnknown) {
            next(new UnsupportedMediaTypeError(type));
        } else {
            next();
        }
    })
};
