/**
 * Author: Jeff Whelpley
 * Date: 10/27/14
 *
 *
 */
var name    = 'jyt.plugins';
var taste   = require('taste');
var target  = taste.target(name);

describe('UNIT ' + name, function () {
    describe('registerPlugin()', function () {
        it('should register a new plugin', function () {
            target.registerPlugin('jtest', function (a, b) {
                return '' + (a + b);
            });
            taste.should.exist(target.plugins.jtest);
            target.plugins.jtest(1, 2).should.equal('3');
        });
    });

    describe('addPluginsToScope()', function () {
        it('should add all registered plugins to the scope', function () {
            var scope = {};
            target.addPluginsToScope(scope);
            taste.should.exist(scope.jtest);
            scope.jtest(1, 2).should.equal('3');
        });
    });

    describe('init()', function () {
        it('should add common plugins', function () {
            target.init();
            taste.should.exist(target.plugins.jif);
            taste.should.exist(target.plugins.jeach);
        });
    });

    describe('jif', function () {
        it('should return null if condition false', function () {
            taste.expect(target.plugins.jif(false, {})).to.be.null;
        });

        it('should return the second value if condition is true', function () {
            target.plugins.jif(true, { val: 'yes' }).should.deep.equal({ val: 'yes' });
        });
    });

    describe('jeach', function () {
        it('should return null if no items', function () {
            taste.expect(target.plugins.jeach()).to.be.null;
        });

        it('should return null if no callback', function () {
            taste.expect(target.plugins.jeach([])).to.be.null;
        });

        it('should call the callbacks and return an array', function () {
            var items = [2, 4, 5, 1];
            var expected = [3, 5, 6, 2];
            var actual = target.plugins.jeach(items, function (item) {
                return item + 1;
            });
            actual.should.deep.equal(expected);
        });
    });
});