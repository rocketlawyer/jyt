[![Build Status](https://travis-ci.org/gethuman/jeff.js.png?branch=master)](https://travis-ci
.org/gethuman/jeff.js)


Jeff.js
=============

Jeff.js is a concise, lightweight JavaScript-based templating engine for HTML (or XML for that matter).
Because it is JavaScript-based, there is no extra parser/lexer needed for either a JavaScript-based
server (like Node), or the browser.  With its extensive shorthand, small amounts of code expand
to large pieces of HTML.  Its plugin system allows you to leverage plugins that others have
written that reduce large, common pieces of markup to a few characters of code.

For anyone familiar with React, there are some similarities between jeff.js and React.DOM
from an API standpoint (not from the underlying Virtual DOM, though).

Installing
----------
Installing Jeff.js is simple. Download the package [from the
official site](http://jeffjs.com/) and add it to your web pages.

Alternatively, you can install it as a node module into your project
like you would any other node module.

Usage
-----
Here's an example that leverages some of Jeff's shorthand:

```js

	 html(
		 head({
			 title: "Jeff demo",
			 "meta[charset=utf8]": null
		 }),
		 body(
			 { class: 'myBody' },
			 h1("Jeff is"),
			 ol(
				 li({ class: 'bullet' }, 'hello')
			),
			div({
			    class:  'someThing',
			    id:     'myId',
			    title:  'Hello, world'
			})
			p("Look how quickly I can make a list of things render in pretty fashion!")
		)
	)

```

As you can see, this essentially looks like HTML except that HTML element are now JavaScript functions
and HTML attributes are now object key-value pairs within an element.

Jeff in the Wild
----------------

* We, GetHuman.com, are the only known users of Jeff at this time.  We built it because we've become obsessed
with JavaScript and cringed at the thought of interrupted our beautiful JS code with HTML or other strange syntax

External Resources
------------------

Have a project using Jeff? Send us a [pull request](https://github.com/gethuman/jeff.js/pull/new/master)!


License
-------
Jeff.js is released under the MIT license.

