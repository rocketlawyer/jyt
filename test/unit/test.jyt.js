/**
 * Author: Jeff Whelpley
 * Date: 10/27/14
 *
 *
 */
var name    = 'jyt';
var taste   = require('taste');
var target  = taste.target(name);

describe('UNIT ' + name, function () {
    describe('addShortcutsToScope()', function () {
        it('should find standard elements and plugins on a scope value', function () {
            var scope = {};
            target.addShortcutsToScope(scope);
            taste.should.exist(scope.div);
            taste.should.exist(scope.jeach);
        });
    });
});