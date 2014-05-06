exports.attach = function(Jeff) {

// BEGIN(BROWSER)

    var fs = require("fs");
    var namedTemplates = {}; // store partials in memory by name

    Jeff.getTemplateByName = function(templateName) {
        return namedTemplates[templateName];
    };

    // constants for use in templating
    var allTags = ["a","iframe","abbr","acronym","address","area","b","base","bdo","big","blockquote","body","br","button","caption","cite","code","col","colgroup","dd","del","dfn","div","dl","dt","em","fieldset","form","h1","h2","h3","h4","h5","h6","head","html","hr","i","img","input","ins","kbd","label","legend","li","link","map","meta","noscript","object","ol","optgroup","option","p","param","pre","q","samp","script","select","small","span","strong","style","sub","sup","table","tbody","td","textarea","tfoot","th","thead","title","tr","tt","ul"];
    var selfClosing = ["area","base","basefont","br","col","frame","hr","img","input","link","meta","param"];

    var jtHtmlPrepend = "<!DOCTYPE html>"; // since this is not even XML compliant - let's just prepend
    var jtPrintIndent = "";
    var jtPrintNewline = "";
    var outputMode = 1; // 0 = leaveAlone, 1 = toString, 2 = toStringPretty, 3 = toDom
    var templateDirs = [];

    Jeff.getTags = function () {
        return Array.concat(allTags, selfClosing);
    };

    Jeff.setOutputMode = function(mode) {
        if ( !isNaN(mode) && mode >= 0 && mode < 3 ) {
            outputMode = mode;
        }
    };

    Jeff.setTemplateDirs = function(dirs) {
        if ( dirs && Jeff.Utils.isArray(dirs) ) {
            templateDirs = dirs;
        }
    };

    Jeff.addTemplateDir = function(dir) {
        templateDirs.push(dir);
    };

    Jeff.elem = function(tagName) { // like this: elem("div", attributes, children, text);
        if ( !Jeff.Utils.isString(tagName) ) {
            return null;
        }
        var e = { tag: tagName, toString: function() { return Jeff.output(e); } };
        if ( arguments.length > 1 ) {
            for ( var i = 1, len = arguments.length; i < len; ++i ) {
                var arg = arguments[i];
                if ( Jeff.Utils.isArray(arg) ) {
                    e.children = arg;
                } else if ( Jeff.Utils.isObject(arg) && arg.tag && arg.toString ) {
                    e.children = [arg];
                } else if ( Jeff.Utils.isObject(arg) ) {
                    e.attributes = arg;
                } else if ( Jeff.Utils.isString(arg) ) {
                    e.text = arg;
                }
            }
        }
        return e;
    };

    // make custom elem method, like div(args...) to represent elem("div", args...)
    function makeElem(tagName) {
        return function() {
            [].unshift.call(arguments, tagName);
            return Jeff.elem.apply(this, arguments);
        };
    }

    // once we have converted our json to "markup", we can now "print" to DOM using document.createElement, etc
    function markupToDom(elem) {
        // todo
        return elem;
    }

    // once we have converted our json to "markup", we can now "print" to a string
    function markupToString(elem, ind) {
        //console.log('printing: ' + JSON.stringify(elem));

        if ( !elem ) {
            return;
        }
        if ( Jeff.Utils.isString(elem) ) {
            return elem;
        }

        var indent = "", indentation = 0, i, len;
        if ( jtPrintIndent && jtPrintIndent.length > 0 ) {
            var indentArr = [];
            if ( ind ) {
                indentation = ind;
            }
            i = indentation;
            while ( i-- ) {
                indentArr.push(jtPrintIndent);
            }
            indent = indentArr.join("");
        }

        var p = [];
        if ( elem.tag && elem.tag === "html" ) {
            p.push(indent, jtHtmlPrepend, jtPrintNewline);
        }
        if ( elem.tag ) {
            p.push(indent, "<", elem.tag);
        }

        //console.log('\n\nelem is ' + JSON.stringify(elem));
        if ( elem.attributes ) {
            //console.log('attributes are ' + JSON.stringify(elem.attributes));
            for( var prop in elem.attributes ) {
                if ( elem.attributes[prop] === null ) {
                    p.push(" ", prop);
                } else {
                    p.push(" ", prop, "=\"", elem.attributes[prop], "\"");
                }
            }
        }
        if ( elem.tag && !elem.children && !elem.text ) {
            if ( selfClosing.indexOf(elem.tag) > -1 ) {
                p.push("/>", jtPrintNewline);
            } else {
                p.push("></", elem.tag, ">", jtPrintNewline);
            }
        } else {
            if ( elem.tag ) {
                p.push(">");
            }
            if ( elem.children ) {
                if ( elem.tag ) {
                    p.push(jtPrintNewline);
                }
                for ( i = 0, len = elem.children.length; i < len; ++i ) {
                    p.push(markupToString(elem.children[i], (elem.tag ? indentation + 1 : indentation) ));
                }
                if ( elem.tag ) {
                    p.push(indent);
                }
            }
            if ( elem.text ) {
                p.push(elem.text);
            }
            if ( elem.tag ) {
                p.push("</", elem.tag, ">", jtPrintNewline);
            }
        }

        return p.join("");
    }

    // actually make tag methods for each of the tags in var allTags
    Jeff.elems = {};
    var i = allTags.length;
    while( i-- ) {
        Jeff.elems[allTags[i]] = makeElem(allTags[i]);
    }

    // PRINTING MARKUP AS HTML
    Jeff.output = function(elem, mode) {
        var currentMode = mode || outputMode;
        if ( currentMode === 0 ) {
            return markupToDom(elem);
        } else if ( currentMode === 2 ) {
            jtPrintIndent = "  ";
            jtPrintNewline = "\n";
            return markupToString(elem);
        } else {
            jtPrintIndent = "";
            jtPrintNewline = "";
            return markupToString(elem);
        }
    };

    Jeff.getTemplate = function(path) {
        if ( namedTemplates[path] ) {
            return namedTemplates[path];
        } else {
            var i = templateDirs.length;
            while( i-- ) {
                var fullpath = templateDirs[i] + "/" + path;
                if ( fs.existsSync(fullpath) ) {
                    path = fullpath;
                    break;
                }
            }
            return require(path);
        }
    };

    Jeff.templateToString = function(result) {
        return (Jeff.Utils.isString(result) ? result : (Jeff.Utils.isArray(result) ? Jeff.naked(result).toString() : result.toString()));
    };

    Jeff.template = function(path) {
        return function(model) {
            var result = Jeff.getTemplate(path)(model);
            return Jeff.templateToString(result, model);
        };
    };

    Jeff.render = function(path, model) {
        return Jeff.template(path)(model);
    };

    Jeff.extends = function(path, model, subTemplates) {
        if ( subTemplates && Jeff.Utils.isObject(subTemplates) ) {
            Jeff.Utils.extend(namedTemplates, subTemplates);
        }
        return Jeff.render(path, model);
    };

    Jeff.extension = function(name) {
        return namedTemplates[name];
    };

    Jeff.addShortcutsToScope = function(scope) {
        // add all of Jeff.elems - these are the methods like div(), a(), li(), etc
        var prop;
        for( prop in Jeff.elems ) {
            scope[prop] = Jeff.elems[prop];
        }

        for ( prop in Jeff.plugins ) {
            scope[prop] = Jeff.plugins[prop];
        }
    };

    Jeff.naked = function(elements, text) {
        return Jeff.elem("", elements, text);
    };

    Jeff.init = function(overrides) {
        Jeff.Utils.extend(Jeff, overrides);
    };

    return Jeff;

};