module.exports = function(model) {
    return html([
        head([
            title("I am a page title")
        ]),
        body([
            Jeff.extension("bodyContent"),
            div(Jeff.extension("rightNavigation"))
        ])
    ]);
};