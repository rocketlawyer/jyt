module.exports = function(model) {
    return Jeff.extends("layout.js", model, {
        "bodyContent": div([
            h1("I am a header"),
            p("I am a section called " + model.foo),
            p(Jeff.render("partial.js", model))
        ]),
        "rightNavigation": ol([
            li("option 1"),
            li("option 2")
        ])
    });
};