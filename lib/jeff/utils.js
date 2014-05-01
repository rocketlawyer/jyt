exports.attach = function(Jeff) {

    var toString = Object.prototype.toString;

// BEGIN(BROWSER)

    Jeff.Utils = {
        extend: function() {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if ( typeof target === "boolean" ) {
                deep = target;

                // skip the boolean and the target
                target = arguments[ i ] || {};
                i++;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if ( typeof target !== "object" && !Jeff.Utils.isFunction(target) ) {
                target = {};
            }

            // return clone of object if only one argument is passed
            if ( i === length ) {
                target = {};
                i--;
            }

            for ( ; i < length; i++ ) {
                // Only deal with non-null/undefined values
                if ( (options = arguments[ i ]) !== null ) {
                    // Extend the base object
                    for ( name in options ) {
                        src = target[ name ];
                        copy = options[ name ];

                        // Prevent never-ending loop
                        if ( target === copy ) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if ( deep && copy && ( Jeff.Utils.isObject(copy) || (copyIsArray = Jeff.Utils.isArray(copy)) ) ) {
                            if ( copyIsArray ) {
                                copyIsArray = false;
                                clone = src && Jeff.Utils.isArray(src) ? src : [];

                            } else {
                                clone = src && Jeff.Utils.isObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[ name ] = Jeff.Utils.extend( deep, clone, copy );

                            // Don't bring in undefined values
                        } else if ( copy !== undefined ) {
                            target[ name ] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        },

        isArray: function(value) {
            return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
        },

        isObject: function(value) {
            return (value && typeof value === 'object') ? toString.call(value) === '[object Object]' : false;
        },

        isFunction: function(obj) {
            return !!(obj && obj.constructor && obj.call && obj.apply);
        },

        isEmptyObject: function(obj) {

            if (obj === null) {
                return true;
            }
            if (obj.length && obj.length > 0) {
                return false;
            }
            if (obj.length === 0) {
                return true;
            }

            for (var key in obj) {
                if (hasOwnProperty.call(obj, key)) {
                    return false;
                }
            }

            // Doesn't handle toString and toValue enumeration bugs in IE < 9

            return true;
        },

        isString: function(str) {
            return (typeof str === 'string' || str instanceof String);
        }

    };

// END(BROWSER)

    return Jeff;
};