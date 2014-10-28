/**
 * Author: Jeff Whelpley
 * Date: 10/24/14
 *
 * Expose functions to the outside world. Everything in JfT is
 * accessed statically for now which means that changes affect
 * everyone who uses jft in a particular runtime.
 */
var plugins = require('./jyt.plugins');
var runtime = require('./jyt.runtime');
var utils   = require('./jyt.utils');

/**
 * Add HTML element functions and all plugins to a given scope
 * @param scope
 */
function addShortcutsToScope(scope) {
    runtime.addElemsToScope(scope);
    plugins.addPluginsToScope(scope);
}

runtime.init();
plugins.init();

// expose functions to the outside world
var jyt = {
    addShortcutsToScope: addShortcutsToScope,
    registerPlugin: plugins.registerPlugin,
    render: runtime.render,
    naked: runtime.naked,
    runtime: runtime,
    utils: utils
};

addShortcutsToScope(jyt);
module.exports = jyt;
