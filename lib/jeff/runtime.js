/*jshint evil: true */
exports.attach = function(Jeff) {

// BEGIN(BROWSER)

    Jeff.namedTemplates = {}; // store partials in memory by name
    Jeff.lastExtendedTemplate = null;

    Jeff.getTemplateStringByPath = function(path) { // override depending on where this is used
        return path;
    };

    Jeff.getTemplateMarkupByName = function(templateName) {
        return Jeff.namedTemplates[templateName];
    };

    Jeff.VM = (function() {  // the main code that does the "compiling" and rendering

        // constants for use in templating
        var N = null;  // so we can say "meta[charset=utf8]:N" instead of "meta[charset=utf8]:null" for child-less tags
        var selfClosing = ["area","base","basefont","br","col","frame","hr","img","input","link","meta","param"];
        var jtModel = null;

        var jtHtmlPrepend = "<!DOCTYPE html>"; // since this is not even XML compliant - let's just prepend
        var jtPrintIndent = "";
        var jtPrintNewline = "";

        var jtNewElement = function() {
            return {tag: null, attributes: null, children: null, text: null};
        };

        var jtExtends = null;
        var jtExtensionPoint = null;

        // this regex implies that elements declare in this order: ID, class(es), attribute(s), like: div#anId.aClz[anAttr]
        var jtElementRegex = /^(\w+)(#\w+)?(\.[\-\w\.]+)*(\[\S+\])*$/;

        // PRINTING MARKUP AS HTML
        // once we have converted our json to "markup", we can not "print" to DOM using document.createElement, etc
        var jtMarkupToDom = function(elem) {
            // todo
        };

        // once we have converted our json to "markup", we can not "print" to a string
        var jtMarkupToString = function(elem, ind) {

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
                        p.push(jtMarkupToString(elem.children[i], (elem.tag ? indentation + 1 : indentation) ));
                    }
                    if ( elem.tag ) {
                        p.push(indent);
                    }
                } else { // must mean text only
                    p.push(elem.text);
                }
                if ( elem.tag ) {
                    p.push("</", elem.tag, ">", jtPrintNewline);
                }
            }

            return p.join("");
        };

        // CONVERSION TO MARKUP
        // convert a name: value pair in the json object to markup
        var jtNameValue = function(name, val, parent) {
            var ret = parent, i, len;

            if ( parent && (name === "attributes" || name === "attr" || name === "attrs" || name === "A") ) {
                if ( Jeff.Utils.isObject(val) ) {
                    parent.attributes = parent.attributes || {};
                    extend(parent.attributes, val);
                } // discard any other odd values
            } else if ( parent && (name === "children" || name === "C") ) {
                if ( Jeff.Utils.isArray(val) ) {
                    for( i = 0; i < val.length; i++ ) {
                        jtItem(val[i], parent);
                    }
                }
            } else if ( parent && name === "text" ) {
                parent.text = val;
            } else if ( parent && (name === "id" || name === "#") ) {
                parent.attributes = parent.attributes || {};
                parent.attributes.id = val;
            } else if ( parent && (name === "class" || name === ".") ) {
                parent.attributes = parent.attributes || {};
                parent.attributes["class"] = (parent.attributes["class"] ? parent.attributes["class"] + " " + val : val);
            } else if ( name === "extends" ) {
                // this template is meant to be rendered within another; val must be an object with key/value pair
                // that indicates the template being extended, and the rest are named extension points, like:
                // extends: { template: "layout.jeff", pageContent: { div: "stuff..." }, rightSide: { div: "more..." } }
                if ( Jeff.Utils.isObject(val) ) {
                    if ( val.template && val.template.length && val.template.length > 0 ) {
                        jtExtends = val.template;
                        for ( var prop in val ) {
                            if ( prop !== "template" ) {
                                Jeff.namedTemplates[prop] = jtItem(val[prop]);
                            }
                        }
                    }
                }
            } else if ( name === "include" || name === "inc" ) {
                // good for including separate files like a partial - but also used for layouts to name extension points
                var includedMarkup = includeMarkup(val);
                if ( includedMarkup ) {
                    if ( !parent.children ) parent.children = [];
                    parent.children.push(includedMarkup);
                }
            } else if ( name !== null ) {

                var elem = jtNewElement();

                // at this point, it really seems like we're starting a new element
                elem.tag = name;

                // parse the name for css selectors
                var reg = name.match(jtElementRegex);
                if (reg !== null && reg.length && reg.length > 0) {
                    if ( reg[1] ) {
                        elem.tag = reg[1];
                    }
                    if ( !elem.attributes && (reg[2] || reg[3] || reg[4]) ) {
                        elem.attributes = {};
                    }
                    if ( reg[2] ) {
                        elem.attributes.id = reg[2].substring(1);
                    }
                    if ( reg[3] ) {
                        elem.attributes["class"] = reg[3].substring(1).split(".").join(" ");
                    }
                    if ( reg[4] ) {
                        var attrs = reg[4].substring(1, reg[4].length - 1).split("][");
                        for( i = 0, len = attrs.length; i < len; ++i ) {
                            var nv = attrs[i].split("=");
                            elem.attributes[nv[0]] = nv[1];
                        }
                    }
                }

                // create any children, attributes, etc from the value in this nv pair
                elem = jtItem(val, elem); // pass this element as the now parent

                if ( parent !== null ) {
                    if ( parent.children === null ) {
                        parent.children = [];
                    }
                    if ( Jeff.Utils.isArray(elem) ) {
                        parent.children = parent.children.concat(elem);
                    } else {
                        parent.children.push(elem);
                    }
                }
            }
            return ret;
        };

        // convert a json object to markup
        var jtObj = function(obj, parent) {
            parent = parent || jtNewElement();
            for ( var prop in obj ) {
                jtNameValue(prop, obj[prop], parent);
            }
            return parent;
        };

        // convert a json array to markup
        var jtArr = function(arr, elem) {

            // in this case, parent is actually the prototype for the element that we'll repeat
            var ret = [], i, len;
            for ( i = 0, len = arr.length; i < len; ++i ) {
                var e = jtNewElement();
                if ( elem ) {
                    e.tag = elem.tag;
                    e.attributes = elem.attributes;
                }
                jtItem(arr[i],e);
                ret.push(e);
            }
            if ( !elem ) { // if this is an array with no parent, need to create an outer/root element for the array
                ret = Jeff.Utils.extend(jtNewElement(), {children: ret});
            }
            return ret;
        };

        // execute a function that returns (hopefully) markup
        /*
         var jtFn = function(fn, parent) {
         console.log("executing function");

         }
         */

        // convert a json string to markup
        var jtStr = function(str, parent) {
            //console.log("translating [" + str + "]");
            parent = parent || jtNewElement();
            parent.text = str;
            return parent;
        };

        // convert a json item to markup
        var jtItem = function(item, parent) {
            if ( Jeff.Utils.isObject(item) ) {
                return jtObj(item, parent);
            } else if ( Jeff.Utils.isArray(item) ) {
                return jtArr(item, parent);
            } else {
                return jtStr(item, parent);
            }
        };

        var jsonStringToJsonItem = function(str, model) {
            var item = null, prop;

            // first, put model into current scope
            if ( model && !Jeff.Utils.isObject(model) ) {
                eval("model = " + model + ";");
            }
            if ( Jeff.Utils.isObject(model) && !Jeff.Utils.isEmptyObject(model) ) {
                for( prop in model ) {
                    eval("var " + prop + " = model[\"" + prop + "\"];");
                }
            }
            // and put helpers into current scope as well
            if ( !Jeff.Utils.isEmptyObject(Jeff.helpers) ) {
                for( prop in Jeff.helpers ) {
                    eval("var " + prop + " = Jeff.helpers[\"" + prop + "\"];");
                }
            }
            try {
                eval("item = " + str + ";");
            } catch (e) {
                console.log("Error parsing JSON");
            }
            return item;
        };

        var includeMarkup = function(path, context) {
            var ret = null;
            var templateSpec = Jeff.getTemplateStringByPath(path);
            if ( templateSpec ) {
                var model = (context ? Jeff.Utils.extend(context, jtModel) : jtModel);
                ret = Jeff.VM.jsonStringToMarkupObject(templateSpec, model);
            } else {
                // no template string gotten - could be that we're extending a named template?
                ret = Jeff.getTemplateMarkupByName(path);
            }
            return ret;
        };

        var include = function(path, context) {
            var ret = null;
            var templateSpec = Jeff.getTemplateStringByPath(path);
            if ( templateSpec ) {
                var model = (context ? Jeff.Utils.extend(context, jtModel) : jtModel);
                ret = Jeff.template(templateSpec)(model);
            } else {
                var markup = Jeff.getTemplateMarkupByName(path);
                if ( markup ) {
                    ret = Jeff.VM.markupObjectToMarkupString(markup);
                }
            }
            return ret;
        };
        var inc = include;

        return {
            jsonStringToMarkupObject: function(str, model) {
                jtModel = model;
                var ret = jtItem(jsonStringToJsonItem(str, model));
                if ( jtExtends ) {
                    if ( jtExtensionPoint ) {
                        Jeff.lastExtendedTemplate = Jeff.namedTemplates[jtExtensionPoint] = ret;
                    } else {
                        Jeff.lastExtendedTemplate = ret;
                    }
                    var surroundSpec = Jeff.getTemplateStringByPath(jtExtends);
                    if ( surroundSpec ) {
                        jtExtends = null;
                        jtExtensionPoint = null;
                        var surround = Jeff.VM.jsonStringToMarkupObject(surroundSpec, model);
                        if ( surround ) {
                            ret = surround;
                        }
                    }
                }
                return ret;
            },
            markupObjectToMarkupString: function(obj) {
                return jtMarkupToString(obj);
            },
            markupObjectToMarkupStringPretty: function(obj) {
                jtPrintIndent = "  ";
                jtPrintNewline = "\n";
                return jtMarkupToString(obj);
            },
            markupObjectToDom: function(obj) {
                return jtMarkupToDom(obj);
            },
            jsonStringToMarkupString: function(str, model) {
                return Jeff.markupObjectToMarkupString(Jeff.jsonStringToMarkupObject(str, model));
            },
            jsonStringToMarkupStringPretty: function(str, model) {
                return Jeff.markupObjectToMarkupStringPretty(Jeff.jsonStringToMarkupObject(str, model));
            }
        };
    }());

    Jeff.compile = function(input) {
        if (input === null || typeof input !== 'string' ) {
            throw new Jeff.Exception("Expecting a string to compile with Jeff, but got " + input);
        }

        var compiled;
        function compile() {
            return Jeff.template(input);
        }

        // Template is only compiled on first use and cached after that point.
        return function(context, options) {
            if (!compiled) {
                compiled = compile();
            }
            return compiled.call(this, context, options);
        };
    };

    Jeff.template = function(templateSpec) {
        return function(context, options) {
            options = options || {};

            var ret, markup = Jeff.VM.jsonStringToMarkupObject(templateSpec, context);

            if ( options && options.prettyPrint ) {
                ret = Jeff.VM.markupObjectToMarkupStringPretty(markup);
            } else {
                ret = Jeff.VM.markupObjectToMarkupString(markup);
            }

            return ret;
        };
    };


// END(BROWSER)

    return Jeff;

};