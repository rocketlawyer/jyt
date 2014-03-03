module.exports.create = function() {

    var Jeff = {};

// BEGIN(BROWSER)

    Jeff.VERSION = "0.2.0";

    Jeff.plugins = {};

    Jeff.registerPlugin = function(name, obj) {
        if ( name && obj && name.length > 0 ) {
            Jeff.plugins[name] = obj;
        }
    };

    Jeff.registerPlugin("each", function(items, tmpl) {
        var ret = [];
        for( var i = 0, len = items.length; i < len; ++i ) {
            ret.push(tmpl(items[i]));
        }
        return ret;
    });

    Jeff.registerPlugin("jif", function(condition, elem) {
        return condition ? elem : '';
    });

    Jeff.registerPlugin("jtrunc", function (str, len) {
        if (!str || str.length < len) {
            return str;
        }
        else {
            return str.substring(0, len) + '...';
        }
    });

// END(BROWSER)

    return Jeff;
};