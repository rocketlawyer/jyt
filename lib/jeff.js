/*global Jeff: true */

var jeff = require("./jeff/base"),
    utils = require("./jeff/utils"),
    runtime = require("./jeff/runtime");

var create = function() {
    var j = jeff.create();

    utils.attach(j);
    runtime.attach(j);

    return j;
};

var Jeff = create();
Jeff.create = create;

module.exports = Jeff; // instantiate an instance

// Publish a Node.js require() handler for .jeff files
if (require.extensions) {
    var extension = function(module, filename) {
        var fs = require("fs");
        var templateString = fs.readFileSync(filename, "utf8");
        module.exports = Jeff.template(templateString);
    };
    require.extensions[".jeff"] = extension;
}

// BEGIN(BROWSER)

// END(BROWSER)

// USAGE:
// var jeff = require('jeff');

// var singleton = jeff.Jeff,
//  local = jeff.create();