module.exports = function(model) {
    return ol(jeach(model.tweets, function(model) {
        return li([
            h1(model.title),
            p(model.content)
        ])
    }));
};