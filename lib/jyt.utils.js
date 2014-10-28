/**
 * Author: Jeff Whelpley
 * Date: 10/27/14
 *
 * We don't want any downstream dependencies (ex. lodash) so this is a re-implementation
 * of several common utility functions so we can use them in JfT.
 */
var toString = Object.prototype.toString;

/**
 * Return true if input value is a function
 * @param value
 * @returns {boolean}
 */
function isFunction(value) {
    return !!(value && value.constructor && value.call && value.apply);
}

/**
 * Return true if input value is an object
 * @param value
 * @returns {boolean}
 */
function isObject(value) {
    return (value && typeof value === 'object') ?
        toString.call(value) === '[object Object]' : false;
}

/**
 * Return true if input value is an array
 * @param value
 * @returns {boolean}
 */
function isArray(value) {
    return (value && typeof value === 'object') ?
        toString.call(value) === '[object Array]' : false;
}

/**
 * Return true if input value is a string
 * @param value
 * @returns {boolean}
 */
function isString(value) {
    return (typeof value === 'string' || value instanceof String);
}

/**
 * Return true if an object and is empty
 * @param obj
 * @returns {boolean}
 */
function isEmptyObject(obj) {
    if (obj === null) {
        return true;
    }
    if (!isObject(obj)) {
        return false;
    }

    for (var key in obj) {
        if (obj.hasOwnProperty(key) && obj[key]) {
            return false;
        }
    }

    return true;
}

/**
 * Equivalent to _.extend() function
 * @returns {*|{}}
 */
function extend() {
    var options, name, src, copy, copyIsArray, clone;
    var target = arguments[0] || {};
    var i = 1;
    var length = arguments.length;
    var deep = false;

    // Handle a deep copy situation
    if (typeof target === 'boolean') {
        deep = target;

        // skip the boolean and the target
        target = arguments[i] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== 'object' && !isFunction(target)) {
        target = {};
    }

    // return clone of object if only one argument is passed
    if (i === length) {
        target = {};
        i--;
    }

    for (; i < length; i++) {

        // Only deal with non-null/undefined values
        if ((options = arguments[i]) !== null) {

            // Extend the base object
            for (name in options) {
                if (options.hasOwnProperty(name)) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (isObject(copy) || (copyIsArray = isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];

                        }
                        else {
                            clone = src && isObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = extend(deep, clone, copy);

                        // Don't bring in undefined values
                    }
                    else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
    }

    // Return the modified object
    return target;
}

// expose all functions for resting purposes (jyt.js limits exposure to outside world)
module.exports = {
    isFunction: isFunction,
    isObject: isObject,
    isArray: isArray,
    isString: isString,
    isEmptyObject: isEmptyObject,
    extend: extend
};
