

JavaScript Your Templates (Jyt)
==================

Jyt is a concise, lightweight JavaScript-based templating engine for HTML (or XML for that matter).
Because it is JavaScript-based, there is no extra parser/lexer needed for either a JavaScript-based
server (like Node), or the browser.  With its extensive shorthand, small amounts of code expand
to large pieces of HTML.  Its plugin system allows you to leverage plugins that others have
written that reduce large, common pieces of markup to a few characters of code.

## Installation

Installation is simple. From your command line enter the following:

```
npm install jyt --save
```

Then in your code you can just use it like any other library:

```
var jyt = require('jyt');

console.log(jyt.render(jyt.div('hello, world')));

// output: <div>hello, world</div>
```

## Getting Rid of jyt Prefix

You don't need the jyt. prefix for HTML functions. There are two ways to remove the prefix and just reference the
HTML functions by themselves.

**Option 1 - Attach to Globals**

This is not and ideal solution, but you can attach to the node.js global object:

```
jyt.addShortcutsToScope(global);
```

**Option 2 - Dependency Injection**

The more ideal solution and what Jyt was built for is to utilize dependency injection. Using
[Pancakes](https://github.com/gethuman/pancakes)
or another dependency injector, your template could look something like this:

```
function generateHtml(div, span, a, img) {
    return div({ 'class': 'wrapper' },
        span('hello, world'),
        div({ 'class': 'inner' },
            a({
                href:  '/blah',
                title: 'click here'
            }, 'Some Link'),
            img({ 'class': 'logo', src: '/something.jpg' })
        )
    );
}
```

I personally prefer this version of markup much more than actual HTML.

## Plugins

For now plugins are really simple. They are just arbitrary functions that will be added to any scope when you
call jyt.addShortcutsToScope(). There are only two common ones built in core:

* jif(condition, element) - If condition true, then HTML element is rendered.
* jeach(items, cb) - Similar to _.each except that the items returned from the callback are rendered.

## Child Repos

There are child repos built on top of this in order to provide specific syntax for a particular technology. The
biggest one right now is [Jangular](https://github.com/gethuman/jangular). Other ones are in the works.




