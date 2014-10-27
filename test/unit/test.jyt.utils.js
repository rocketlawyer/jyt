/**
 * Author: Jeff Whelpley
 * Date: 10/27/14
 *
 *
 */
var name    = 'jyt.utils';
var taste   = require('taste');
var target  = taste.target(name);

describe('UNIT ' + name, function () {
    describe('isFunction', function () {
        it('should be false if not a function', function () {
            target.isFunction({}).should.equal(false);
        });

        it('should be true if a function', function () {
            target.isFunction(function () {}).should.equal(true);
        });
    });

    describe('isObject', function () {
        it('should be false if not an object', function () {
            target.isObject('hello').should.equal(false);
        });

        it('should be true if an object', function () {
            target.isObject({ blah: 'yes' }).should.equal(true);
        });
    });

    describe('isArray', function () {
        it('should be false if not an array', function () {
            target.isArray({}).should.equal(false);
        });

        it('should be true if an array', function () {
            target.isArray([]).should.equal(true);
        });
    });

    describe('isString', function () {
        it('should be false if not a string', function () {
            target.isString({}).should.equal(false);
        });

        it('should be true if a string', function () {
            target.isString('hello').should.equal(true);
        });
    });

    describe('isEmptyObject', function () {
        it('should be false if a string', function () {
            target.isEmptyObject('asdf').should.equal(false);
        });

        it('should be false if not an empty object', function () {
            target.isEmptyObject({ blah: 'yes' }).should.equal(false);
        });

        it('should be true if an empty object', function () {
            target.isEmptyObject({}).should.equal(true);
        });
    });

    describe('extend()', function () {
        it('should extend an objet with one other', function () {
            var obj1 = { foo: 'choo' };
            var obj2 = { zoo: 'woo' };
            var expected = { foo: 'choo', zoo: 'woo' };
            var returnObj = target.extend(obj1, obj2);
            returnObj.should.deep.equal(expected);
            obj1.should.deep.equal(expected);
        });

        it('should extend multiple objects', function () {
            var obj1 = { foo: 'choo' };
            var expected = { foo: 'choo', zoo: 'woo2', a: 'z', f: 'asd' };
            var returnObj = target.extend(obj1, { zoo: 'woo2' }, { a: 'z' }, { f: 'asd' });
            returnObj.should.deep.equal(expected);
            obj1.should.deep.equal(expected);
        });

        it('should extend a function', function () {
            var obj = {};
            var fn = function () { return 123 + 123; };
            target.extend(obj, { fn: fn });
            obj.fn.toString().should.equal(fn.toString());
        });
    });
});