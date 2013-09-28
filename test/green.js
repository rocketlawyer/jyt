describe("easy stuff", function() {
    it("hello world", function() {
        shouldCompileTo("{div: 'Hello World'}", { foo: "foo" }, "<div>Hello World</div>");
    });

    it("html basic", function() {
        shouldCompileTo("{html:{head:{title:'page title'},body:'hello world'}}", {foo: "foo"}, "<!DOCTYPE html><html><head><title>page title</title></head><body>hello world</body></html>")
    })
});