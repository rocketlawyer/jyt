module.exports = function(model) {
    return div([
        p("this is a partial - holy crap!"),
        a("and I can read from model too: " + model.bar.baz)
    ]);
};