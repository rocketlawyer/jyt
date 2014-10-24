exports.attach = function (Jeff) {

// BEGIN(BROWSER)

    Jeff.registerPlugin = function(name, obj) {
        if ( name && obj && name.length > 0 ) {
            Jeff.plugins[name] = obj;
        }
    };

    Jeff.registerPlugin("jif", function(condition, elem) {
        if (elem instanceof Array) {
            elem = Jeff.naked(elem);
        }
        return condition ? elem : '';
    });

    Jeff.registerPlugin("jeach", function(items, tmpl) {
        if (!items || !tmpl) {
            return null;
        }

        var ret = [];
        for( var i = 0, len = items.length; i < len; ++i ) {
            ret.push(tmpl(items[i]));
        }
        return ret;
    });

    Jeff.registerPlugin("jbind", function (model, fieldName, defaultValue) {
        defaultValue = (defaultValue || 0) + '';

        if (!model || !fieldName) {
            return defaultValue;
        }

        var fieldNameParts = fieldName.split('.');
        var i, field;
        var pointer = model;

        for (i = 0; i < fieldNameParts.length; i++) {
            field = fieldNameParts[i];
            pointer = pointer[field];

            if (!pointer) {
                return defaultValue;
            }
        }


        return (pointer || defaultValue) + '';
    });

    Jeff.registerPlugin("jclass",function (classes) {
        if (!classes) { return ''; }

        var cssClassList = '';
        for (var cls in classes) {
            if (classes.hasOwnProperty(cls) && classes[cls]) {
                cssClassList += ' ' + cls;
            }
        }

        return cssClassList;
    });


// END(BROWSER)

    return Jeff;
};