module.exports.create = function() {

    var Jeff = {};

// BEGIN(BROWSER)

    Jeff.VERSION = "0.1.0";
    // are you looking for a compiler?  Jeff doesn't have one because JSON is (obv) already compiled for javascript

    Jeff.helpers = {};
    Jeff.partials = {};
    Jeff.plugins = {};

    var toString = Object.prototype.toString,
        objectType = '[object Object]';

    Jeff.registerHelper = function(name, fn, inverse) {
        if (toString.call(name) === objectType) {
            if (inverse || fn) { throw new Jeff.Exception('Arg not supported with multiple helpers'); }
            Jeff.Utils.extend(this.helpers, name);
        } else {
            if (inverse) { fn.not = inverse; }
            this.helpers[name] = fn;
        }
    };

    Jeff.registerPartial = function(name, str) {
        if (toString.call(name) === objectType) {
            Jeff.Utils.extend(this.partials,  name);
        } else {
            this.partials[name] = str;
        }
    };

    Jeff.registerPlugin = function(name, obj) {
        this.plugins[name] = obj;
    };

    Jeff.createFrame = function(object) {
        var obj = {};
        Jeff.Utils.extend(obj, object);
        return obj;
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
        var vn = varName || "it";
        var ret = [];
        for( var i = 0, len = items.length; i < len; ++i ) {
            eval("var " + vn + " = items[i]; ret.push(" + tmpl + ")");
        }
        return ret;
    });

// END(BROWSER)

    return Jeff;
};