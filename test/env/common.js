global.should = require('should');

global.shouldCompileFileTo = function(filepath, model, expected, message) {
    var path = require('path');
    var testDir = path.dirname(__dirname);
    //var template = Jeff.template(testDir + "/" + filepath);
    //var result = template(model).toString();
    var result = Jeff.render(testDir + '/' + filepath, model);
    result.should.equal(expected, "'" + expected + "' should === '" + result + "': " + message);
};

global.equals = global.equal = function(a, b, msg) {
    a.should.equal(b, msg || '');
};