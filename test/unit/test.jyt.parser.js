/**
 * Author: Jeff Whelpley
 * Date: 2/15/15
 *
 * Testing the parser
 */
var name    = 'jyt.parser';
var taste   = require('taste');
var target  = taste.target(name);
var runtime = taste.target('jyt.runtime');
var elems   = runtime.elems;

function compare(html, expected, done) {
    target.parse(html, function (err, actual) {
        if (err) { done(err); }
        actual.should.deep.equal(expected);
        //JSON.stringify(actual).should.equal(JSON.stringify(expected));
        done();
    });
}

describe('UNIT ' + name, function () {
    before(function () { runtime.init(); });

    describe('parse()', function () {
        it('should compare one elem with attr', function (done) {
           var html = '<div ng-click="blah"></div>';
           var expected = elems.div({ 'ng-click': 'blah' });
            compare(html, expected, done);
        });

        it('should compare elem with string value', function (done) {
            var html = '<div ng-click="blah">hello, world</div>';
            var expected = elems.div({ 'ng-click': 'blah' }, 'hello, world');
            compare(html, expected, done);
        });

        it('should have a more complex value', function (done) {
            var html = '<div ng-click="blah">' +
                    '<span class="foo">something here</span>' +
                    '<a href="/">link here</a>' +
                '</div>';
            var expected = elems.div({ 'ng-click': 'blah' },
                elems.span({ 'class': 'foo' }, 'something here'),
                elems.a({ 'href': '/' }, 'link here')
            );
            compare(html, expected, done);
        });
    });
});