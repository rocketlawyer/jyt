exports.attach = function(Jeff) {

    var toString = Object.prototype.toString,
        isArray = Array.isArray;

// BEGIN(BROWSER)

    // not sure we'll ever need this, but good to start on the right foot...
    var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

    Jeff.Exception = function(message) {
        var tmp = Error.prototype.constructor.apply(this, arguments);

        // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
        for (var idx = 0; idx < errorProps.length; idx++) {
            this[errorProps[idx]] = tmp[errorProps[idx]];
        }
    };
    Jeff.Exception.prototype = new Error();

    Jeff.Utils = {
        extend: function(obj, value) {
            for(var key in value) {
                if(value.hasOwnProperty(key)) {
                    obj[key] = value[key];
                }
            }
        },

        inArray: function(arr, obj) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === obj) {
                    return true;
                }
            }
            return false;
        },

        isArray: function(value) {
            return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
        },

        isObject: function(value) {
            return (value && typeof value === 'object') ? toString.call(value) === '[object Object]' : false;
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
        }

    };

// END(BROWSER)

    return Jeff;
};