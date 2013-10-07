describe("easy stuff", function() {
    it("hello world", function() {
        shouldCompileTo("{div: 'Hello World'}", { foo: "foo" }, "<div>Hello World</div>");
    });

    it("html basic", function() {
        shouldCompileTo("{html:{head:{title:'page title'},body:'hello world'}}", {foo: "foo"}, "<!DOCTYPE html><html><head><title>page title</title></head><body>hello world</body></html>")
    })

    it("file hello world", function() {
        shouldCompileFileTo("basic.jeff", {foo: "foo"}, "<div>Hello World</div>")
    })

    it("small html page", function() {
        shouldCompileFileTo("basicPage.jeff", {foo: "foo"}, "<!DOCTYPE html><html><head><title>I am a page title</title></head><body><div><h1>I am a header</h1><p>...and I am that header's section</p></div></body></html>")
    })

    it("html page with model", function() {
        shouldCompileFileTo("basicPageModel.jeff", {foo: "foo's content", bar: {baz: "bar.baz's content", bam: "something else"}}, "<!DOCTYPE html><html><head><title>I am a page title</title></head><body><div><h1>I am a header</h1><p>...and I am a section with dynamic content drawn from variable foo: foo's content</p><p class=\"2\">...and I am a section with dynamic content drawn from variable bar.baz: bar.baz's content</p></div></body></html>")
    })

    it("html page with model and partial", function() {
        shouldCompileNodeFileTo("basicPageModelPartial.jeff", {foo: "Goldie", bar: {baz: "Jeff", bam: "Christian"}}, "<!DOCTYPE html><html><head><title>I am a page title</title></head><body><div><h1>I am a header</h1><p>I am a section called Goldie</p><p class=\"2\"><div><p>this is a partial - holy crap!</p><a>and I can read from model too: Jeff</a></div></p></div></body></html>")
    })

    it("html page with model and partial that extends a layout", function() {
        shouldCompileNodeFileTo("basicPageModelPartialExtends.jeff", {foo: "Goldie", bar: {baz: "Jeff", bam: "Christian"}}, "<!DOCTYPE html><html><head><title>I am a page title</title></head><body><div><h1>I am a header</h1><p>I am a section called Goldie</p><p class=\"2\"><div><p>this is a partial - holy crap!</p><a>and I can read from model too: Jeff</a></div></p></div><div><ol><li>option 1</li><li>option 2</li></ol></div></body></html>")
    })

    it("list that uses the array method to shorthand lists", function() {
        shouldCompileFileTo("list.jeff", {}, "<ol><li>this should be plain</li><li>and this too</li></ol>")
    })

    it("list at the top level", function() {
        shouldCompileFileTo("listParent.jeff", {}, "<div>exposed</div><p>top level</p>")
    })

    it("list that uses the array method to shorthand lists", function() {
        shouldCompileFileTo("listNested.jeff", {}, "<ol><li>this should be plain</li><li class=\"second\">but this should have a class</li><li><div>nested div</div><p>nested p</p></li><li><span>another way to nest</span></li></ol>")
    })

    it("test the each helper function", function() {
        shouldCompileFileTo("each.jeff", { tweets: [{title: "title 1", content: "content 1"},{title: "title 2", content: "content 2"}] }, "<ol><li><h1>title 1</h1><p>content 1</p></li><li><h1>title 2</h1><p>content 2</p></li><li class=\"2\"><p>content 1</p></li><li class=\"2\"><p>content 2</p></li></ol>")
    })

    it("test the ability to add a plugin", function() {
        Jeff.registerPlugin("bootstrap", {
            nav: function(items, activeItem) {
                var code = null;
                if ( items && items.length && items.length > 0 ) {
                    var code = { "nav.navbar" : { "ol": { "li.navbar-nav": [] }}};
                    for( var i = 0, len = items.length; i < len; ++i ) {
                        if ( activeItem && items[i] === activeItem ) {
                            code["nav.navbar"].ol["li.navbar-nav"].push({ "class": "active", "text": items[i]});
                        } else {
                            code["nav.navbar"].ol["li.navbar-nav"].push(items[i]);
                        }
                    }
                }
                return code;
            }
        });
        shouldCompileFileTo("plugin.jeff", null, "<div><a href=\"/\">Home</a><div><nav class=\"navbar\"><ol><li class=\"navbar-nav\">Home</li><li class=\"navbar-nav\">About</li><li class=\"navbar-nav\">Contact</li></ol></nav></div></div>")
    })

});