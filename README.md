[![Build Status](https://travis-ci.org/gethuman/jeff.js.png?branch=master)](https://travis-ci
.org/gethuman/jeff.js)


Jeff.js
=============

Jeff.js is a concise, lightweight JSON-based templating engine for HTML (or XML for that matter).
Because it is JSON-based, there is no extra parser/lexer needed for either a JavaScript-based
server (like Node), or the browser.  With its extensive shorthand, small amounts of code expand
to large pieces of HTML.  Its plugin system allows you to leverage plugins that others have
written that reduce large, common pieces of markup to a few characters of code.

Installing
----------
Installing Jeff.js is simple. Download the package [from the
official site](http://jeffjs.com/) and add it to your web pages.

Alternatively, you can install it as a node module into your project
like you would any other node module.

Usage
-----
Once you've written a template, use the `Jeff.compile` method to compile
the template into a function. The generated function takes a context
argument, which will be used to render the template.

Here's an example that leverages some of Jeff's shorthand:

```js
{
	 html: {
		 head: {
			 title: "Jeff demo",
			 "meta[charset=utf8]": null
		 },
		 body: {
			 "div#myID.jumbotron.anotherClz": "Welcome " + user.first + " to the Jeff.js demo",
			 h1: "Jeff is",
			 ol: {
				 "li.bullet": [
					 "Concise",
					 "All JavaScript (well JSON...)",
					 (10 * 7 + 4) + " more awesome things we don't have time to point out"
				 ]
			},
			p: "Look how quickly I can make a list of things render in pretty fashion!",
			div: Jeff.each(items, "{ \"img[src=/images/icon.png]\": N, p: it.name, small: it.caption }")
		}
	}
}
```

Could be used like this (in node):

```js
var fs = require('fs');

fs.readFile('/test/theAboveFile.json', 'utf8', function (err, contents) {
    if ( !err ) {
        var template = Jeff.compile(contents);

        var model = { user: { first: "Christian", last: "A." }, items: [
            { name: "example 1", caption: "look at example 1!" }, { name: "ex. 2", caption: "and example 2!" } ] };

        var result = template(model);
    }
});
```

And would render the following:

```
<!DOCTYPE html>
<html>
  <head>
    <title>Jeff demo</title>
    <meta charset="utf8"/>
  </head>
  <body>
    <div id="myID" class="jumbotron anotherClz">Welcome Christian to the Jeff.js demo</div>
    <h1>Jeff is</h1>
    <ol>
      <li class="bullet">Concise</li>
      <li class="bullet">All JavaScript (well JSON...)</li>
      <li class="bullet">74 more awesome things we don't have time to point out</li>
    </ol>
    <p>Look how quickly I can make a list of things render in pretty fashion!</p>
    <div>
      <img src="/images/icon.png"/>
      <p>1 min ago</p>
      <small>This is an awesome tweet!</small>
    </div>
    <div>
      <img src="/images/icon.png"/>
      <p>3 mins ago</p>
      <small>Something happened!</small>
    </div>
    <div>
      <img src="/images/icon.png"/>
      <p>7 mins ago</p>
      <small>a long, long time ago...</small>
    </div>
  </body>
</html>
```

Registering Plugins
-------------------

You can register plugins that add to the default functionality of Jeff with ease.

Here is a snippet of a Jeff json template:

```js
{
    div: bootstrapNav.navPills(["Home", "About", "Feedback"], "About");
}
```

Here is my sample jeff-bootstrap-nav.js plugin, so I don't have to remember exactly
how to structure my bootstrap navigation bars:

```js
{
    navPills: function(items, activeItem) {
		 var ret = { "ul.nav.nav-pills": { li: [] } };
		 for( var i = 0, len = items.length, r = ret["ul.nav.nav-pills"]["li"]; i < len; ++i ) {
		     if ( items[i] === activeItem ) r.push({ attributes: { class: "active" }, text: items[i]});
			 else r.push(items[i]);
		 }
		 return ret;
    }
}
```

Would be registered and used like this:

```js

var jeff = require("jeff");
var fs = require('fs');

Jeff.registerPlugin("bootstrapNav", "/plugins/jeff-bootstrap-nav.js");

fs.readFile('/test/theAboveFile.json', 'utf8', function (err, contents) {
    if ( !err ) {
        var template = Jeff.compile(contents);
        var result = template(model);
    }
});
```

And would render this:

```
<ul class="nav nav-pills">
    <li>Home</li>
    <li class="active">About</li>
    <li>Feedback</li>
</ul>
```


### Partials

Jeff treats all input like a partial, so no need to specify that something
is "partial", just include it like you would any other Jeff templating.


### Comments

Jeff is based in Javascript (JSON), so comments work exactly as they do in Javascript


### Optimizations

- It's just all very fast - as fast as your Javascript engine that is

Supported Environments
----------------------

Jeff has been designed to work in any ECMAScript 3 environment. This includes

- Node.js
- Chrome
- Firefox
- Safari 5+
- Opera 11+
- IE 6+

Older versions and other runtimes are likely to work but have not been formally
tested.

Performance
-----------

At the time, Jeff does not separate the compile and render steps for its templates.
Despite this, Jeff often outperforms other templating engines and has a smaller
footprint because most of its compiling and rendering depends on the speed of the
JavaScript engine processing it.  And generally, those engines are getting faster
and better by the minute.

Building
--------

To build Jeff, just run `grunt build`, and the build will output to the `dist` directory.


Upgrading
---------

See [release-notes.md](https://github.com/gethuman/jeff.js/blob/master/release-notes.md) for upgrade notes,
of which there aren't any yet.  :)

Known Issues
------------
* Remember that your template must be valid JSON for it to render.  If you're unsure, use a JSON validator
like [JSONLint](http://jsonlint.com)

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

