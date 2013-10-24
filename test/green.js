describe("easy stuff", function() {


    it("file hello world", function() {
        shouldCompileFileTo("res/basic.js", {foo: "foo"}, "<div>Hello World</div>")
    })

    it("html snippet", function() {
        shouldCompileFileTo("res/basicHtml.js", {foo: "foo"}, "<!DOCTYPE html><html><head><title>I am a title</title></head><body>and body is here</body></html>")
    })

    it("small html page", function() {
        shouldCompileFileTo("res/basicPage.js", {foo: "foo"}, "<!DOCTYPE html><html><head><title>I am a page title</title></head><body><div><h1>I am a header</h1><p>...and I am that header's section</p></div></body></html>")
    })

    it("html page with model", function() {
        shouldCompileFileTo("res/basicPageModel", {foo: "foo's content", bar: {baz: "bar.baz's content", bam: "something else"}}, "<!DOCTYPE html><html><head><title>I am a page title</title></head><body><div><h1>I am a header</h1><p>...and I am a section with dynamic content drawn from variable foo: foo's content</p><p>...and I am a section with dynamic content drawn from variable bar.baz: bar.baz's content</p></div></body></html>")
    })

    it("html page with model and partial", function() {
        shouldCompileFileTo("res/basicPageModelPartial", {foo: "Goldie", bar: {baz: "Jeff", bam: "Christian"}}, "<!DOCTYPE html><html><head><title>I am a page title</title></head><body><div><h1>I am a header</h1><p>I am a section called Goldie</p><p><div><p>this is a partial - holy crap!</p><a>and I can read from model too: Jeff</a></div></p></div></body></html>")
    })

    it("html page with model and partial that extends a layout", function() {
        shouldCompileFileTo("res/basicPageModelPartialExtends", {foo: "Goldie", bar: {baz: "Jeff", bam: "Christian"}}, "<!DOCTYPE html><html><head><title>I am a page title</title></head><body><div><h1>I am a header</h1><p>I am a section called Goldie</p><p><div><p>this is a partial - holy crap!</p><a>and I can read from model too: Jeff</a></div></p></div><div><ol><li>option 1</li><li>option 2</li></ol></div></body></html>")
    })

    it("test the each plugin", function() {
        shouldCompileFileTo("res/each.js", { tweets: [{title: "title 1", content: "content 1"},{title: "title 2", content: "content 2"}] }, "<ol><li><h1>title 1</h1><p>content 1</p></li><li><h1>title 2</h1><p>content 2</p></li></ol>")
    })

    it("test the ability to add a plugin", function() {
        Jeff.registerPlugin("bootstrap", {
            nav: function(items, activeItem) {
                var navItems = [];
                for( var i = 0, len = items.length; i < len; ++i ) {
                    if ( activeItem && items[i] === activeItem ) {
                        navItems.push(Jeff.elems.li({ "class": "active navbar-nav" }, items[i]));
                    } else {
                        navItems.push(Jeff.elems.li({ "class": "navbar-nav" }, items[i]));
                    }
                }
                return Jeff.elem("nav", {class: "navbar"}, [Jeff.elems.ol(navItems)])
            }
        });
        Jeff.addShortcutsToScope(global); // call this again to make sure plugin included
        shouldCompileFileTo("res/plugin.js", null, "<div><a href=\"/\">Home</a><div><nav class=\"navbar\"><ol><li class=\"navbar-nav\">Home</li><li class=\"active navbar-nav\">About</li><li class=\"navbar-nav\">Contact</li></ol></nav></div></div>")
    })

});