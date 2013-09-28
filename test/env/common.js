global.should = require('should');

global.shouldCompileTo = function(string, model, expected, message) {
    var template = Jeff.template(string);
    var result = template(model);
    result.should.equal(expected, "'" + expected + "' should === '" + result + "': " + message);
};

global.equals = global.equal = function(a, b, msg) {
    a.should.equal(b, msg || '');
};