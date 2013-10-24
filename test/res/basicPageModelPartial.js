module.exports = function(model){
    return html([
        head([
            title("I am a page title")
        ]),
        body([
            div([
                h1("I am a header"),
                p("I am a section called " + model.foo),
                p(require("./partial.js")(model))
            ])
        ])
    ]);
};