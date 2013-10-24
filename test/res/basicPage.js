module.exports = function(model) {
    return html([
        head([
            title("I am a page title")
        ]),
        body([
            div([
                h1("I am a header"),
                p("...and I am that header's section")
            ])
        ])
    ]);
};