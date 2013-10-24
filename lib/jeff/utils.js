exports.attach = function(Jeff) {

    var toString = Object.prototype.toString,
        isArray = Array.isArray;

// BEGIN(BROWSER)

    Jeff.Utils = {
        extend: function(obj, value) {
            for(var key in value) {
                if(value.hasOwnProperty(key)) {
                    obj[key] = value[key];
                }
            }
            return obj;
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
        },

        isString: function(str) {
            return (typeof str == 'string' || str instanceof String);
        }

    };

// END(BROWSER)

    return Jeff;
};