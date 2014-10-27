/**
 * Author: Jeff Whelpley
 * Date: 10/27/14
 *
 * Since JfT is accessed statically, we store all plugins statically
 * as well.
 */
var utils   = require('./jyt.utils');
var runtime = require('./jyt.runtime');
var plugins = {};

/**
 * Add all existing plugins to the input scope
 * @param scope
 */
function addPluginsToScope(scope) {
    var name;
    for (name in plugins) {
        if (plugins.hasOwnProperty(name)) {
            scope[name] = plugins[name];
        }
    }
}

/**
 * Register a new plugin
 * @param name
 * @param obj
 */
function registerPlugin(name, obj) {
    if (name && name.length && obj) {
        plugins[name] = obj;
    }
}

/**
 * Register common plugins
 */
function init() {

    // ex. jif(true, div('blah'))
    registerPlugin("jif", function jif(condition, elem) {
        if (utils.isArray(elem)) {
            elem = runtime.naked(elem, null);
        }

        return condition ? elem : null;
    });

    // ex. jeach({}, function (item) {})
    registerPlugin("jeach", function jeach(items, cb) {
        if (!items || !cb) { return null; }

        var ret = [];
        for (var i = 0, len = items.length; i < len; ++i) {
            ret.push(cb(items[i]));
        }

        return ret;
    });
}

// export all functions for use by jft
module.exports = {
    plugins: plugins,
    addPluginsToScope: addPluginsToScope,
    registerPlugin: registerPlugin,
    init: init
};