require('./common');

/*
global.shouldCompileNodeFileTo = function(filepath, model, expected, message) {
    var fs = require('fs');
    var path = require('path');
    var testDir = path.dirname(__dirname);
    var templateString = fs.readFileSync(testDir + "/" + filepath, 'utf8');
    var template = Jeff.template(templateString);
    var result = template(model);
    result.should.equal(expected, "'" + expected + "' should === '" + result + "': " + message);
};
*/
var path = require("path");
var testResources = path.dirname(__dirname) + "/res";
global.Jeff = require('../../lib/jeff');
Jeff.addShortcutsToScope(global);
Jeff.addTemplateDir(testResources);

