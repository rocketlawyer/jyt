/**
 * Author: Jeff Whelpley
 * Date: 10/27/14
 *
 *
 */
var name    = 'jyt.runtime';
var taste   = require('taste');
var target  = taste.target(name);

describe('UNIT ' + name, function () {
    describe('init()', function () {
        it('should run init without an error', function () {
            target.init();
        });
    });

    describe('render()', function () {
        it('should convert a basic div to html', function () {
            var expected = '<div>Hello World</div>';
            var obj = target.elems.div('Hello World');
            var actual = target.render(obj);
            actual.should.equal(expected);
        });

        it('should convert basic HTML', function () {
            var expected = '<html><head><title>title here</title></head><body>body here</body></html>';
            var obj = target.elems.html(
                target.elems.head(
                    target.elems.title('title here')
                ),
                target.elems.body('body here')
            );
            var actual = target.render(obj);
            actual.should.equal(expected);
        });

        it('should render an attribute', function () {
            var expected = '<div blah="foo">hello</div>';
            var obj = target.elems.div({ blah: 'foo' }, 'hello');
            var actual = target.render(obj);
            actual.should.equal(expected);
        });

        it('should render an array of children', function () {
            var expected = '<div><span>one</span><b>two</b></div>';
            var obj = target.elems.div([
                target.elems.span('one'),
                target.elems.b('two')
            ]);
            var actual = target.render(obj);
            actual.should.equal(expected);
        });

        it('should render a set of functions wo an array', function () {
            var expected = '<div><span>one</span><b>two</b></div>';
            var obj = target.elems.div(
                target.elems.span('one'),
                target.elems.b('two')
            );
            var actual = target.render(obj);
            actual.should.equal(expected);
        });
    });
});