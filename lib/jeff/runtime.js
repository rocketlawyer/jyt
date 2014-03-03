exports.attach = function(Jeff) {

// BEGIN(BROWSER)

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
    var outputMode = 1; // 0 = toDom, 1 = toString, 2 = toStringPretty
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
        var e = { tag: tagName, render: function() { return Jeff.output(e); } };
        if ( arguments.length > 1 ) {
            for ( var i = 1, len = arguments.length; i < len; ++i ) {
                if ( Jeff.Utils.isArray(arguments[i]) ) {
                    e.children = arguments[i];
                } else if ( Jeff.Utils.isObject(arguments[i]) ) {
                    e.attributes = arguments[i];
                } else if ( Jeff.Utils.isString(arguments[i]) ) {
                    e.text = arguments[i];
                }
            }
        }
        return Jeff.output(e);
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

        if ( elem.attributes ) {
            for( var prop in elem.attributes ) {
                p.push(" ", prop, "=\"", elem.attributes[prop], "\"");
            }
        }
        if ( elem.tag && !elem.children && !elem.text ) {
            if ( Jeff.Utils.inArray(selfClosing, elem.tag) ) {
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

    Jeff.template = function(path) {
        var fs = require("fs");
        if ( fs && templateDirs.length > 0 ) {
            var i = templateDirs.length;
            while( i-- ) {
                var fullpath = templateDirs[i] + "/" + path;
                //console.log("trying " + fullpath);
                if ( fs.existsSync(fullpath) ) {
                    return require(fullpath);
                }
            }
        }
        return require(path);
    };

    Jeff.extends = function(path, model, subTemplates) {
        if ( subTemplates && Jeff.Utils.isObject(subTemplates) ) {
            Jeff.Utils.extend(namedTemplates, subTemplates);
        }
        return Jeff.template(path)(model);
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

    return Jeff;

};