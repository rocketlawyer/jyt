/*global Jeff: true */

var jeff = require("./jeff/base"),
    utils = require("./jeff/utils"),
    plugins = require("./jeff/plugins"),
    runtime = require("./jeff/runtime");

var create = function() {
    var j = jeff.create();

    utils.attach(j);
    plugins.attach(j);
    runtime.attach(j);

    return j;
};

var Jeff = create();
Jeff.create = create;

/*
var fs = require("fs"), path = require("path");
if ( fs && path ) {
    Jeff.getTemplateStringByPath = function(filepath) { // override depending on where this is used
        var fullpath = __dirname + "/../test" + "/" + filepath;
        if ( fs.existsSync(fullpath) ) {
            return fs.readFileSync(fullpath, 'utf8');
        }
        return null;
    };
}
*/

Jeff.timestamp = (new Date()).getTime();

module.exports = Jeff; // instantiate an instance

// Publish a Node.js require() handler for .jeff files and method for grabbing template files
if (require.extensions) {
    var extension = function(module, filename) {
        module.exports = Jeff.template(filename);
    };
    require.extensions[".jeff"] = extension;
}

// BEGIN(BROWSER)

// END(BROWSER)

// USAGE:
// var jeff = require('jeff');

// var singleton = jeff.Jeff,
//  local = jeff.create();