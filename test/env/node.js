require('./common');

global.shouldCompileNodeFileTo = function(filepath, model, expected, message) {
    var fs = require('fs');
    var path = require('path');
    var testDir = path.dirname(__dirname);
    var templateString = fs.readFileSync(testDir + "/" + filepath, 'utf8');
    var template = Jeff.template(templateString);
    var result = template(model);
    result.should.equal(expected, "'" + expected + "' should === '" + result + "': " + message);
};

global.Jeff = require('../../lib/jeff');

