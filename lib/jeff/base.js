module.exports.create = function() {

    var Jeff = {};

// BEGIN(BROWSER)

    Jeff.VERSION = "0.1.0";
    // are you looking for a compiler?  Jeff doesn't have one because JSON is (obv) already compiled for javascript

    Jeff.helpers = {};

    var toString = Object.prototype.toString,
        objectType = '[object Object]';

    Jeff.registerHelper = function(name, fn) {
        if (toString.call(name) === objectType) {
            Jeff.Utils.extend(Jeff.helpers, name);
        } else {
            Jeff.helpers[name] = fn;
        }
    };

    Jeff.registerPlugin = function(name, obj) {
        Jeff.helpers[name] = obj;
    };

    Jeff.logger = {
        DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

        methodMap: {0: 'debug', 1: 'info', 2: 'warn', 3: 'error'},

        // can be overridden in the host environment
        log: function(level, obj) {
            if (Jeff.logger.level <= level) {
                var method = Jeff.logger.methodMap[level];
                if (typeof console !== 'undefined' && console[method]) {
                    console[method].call(console, obj);
                }
            }
        }
    };

    Jeff.log = function(level, obj) { Jeff.logger.log(level, obj); };

    /* jshint evil:true */
    Jeff.registerHelper("each", function(items, varName, tmpl) {
        var vn = (tmpl ? varName : "it");
        tmpl = tmpl || varName;
        var ret = [];
        for( var i = 0, len = items.length; i < len; ++i ) {
            eval("var " + vn + " = items[i]; ret.push(" + tmpl + ")");
        }
        return ret;
    });

// END(BROWSER)

    return Jeff;
};