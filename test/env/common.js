global.should = require('should');

global.shouldCompileTo = function(string, model, expected, message) {
    var template = Jeff.template(string);
    var result = template(model);
    result.should.equal(expected, "'" + expected + "' should === '" + result + "': " + message);
};

global.shouldCompileFileTo = function(filepath, model, expected, message) {
    var fs = require('fs');
    var path = require('path');
    var testDir = path.dirname(__dirname);
    var templateString = fs.readFileSync(testDir + "/" + filepath, 'utf8');
    var template = Jeff.template(templateString);
    var result = template(model);
    result.should.equal(expected, "'" + expected + "' should === '" + result + "': " + message);
};

global.equals = global.equal = function(a, b, msg) {
    a.should.equal(b, msg || '');
};