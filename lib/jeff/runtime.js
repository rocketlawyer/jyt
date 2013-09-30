/*jshint evil: true */
exports.attach = function(Jeff) {

// BEGIN(BROWSER)

    Jeff.VM = (function() {  // the main code that does the "compiling" and rendering

        // constants for use in templating
        var N = null;  // so we can say "meta[charset=utf8]:N" instead of "meta[charset=utf8]:null" for child-less tags
        var selfClosing = ["area","base","basefont","br","col","frame","hr","img","input","link","meta","param"];

        var jtHtmlPrepend = "<!DOCTYPE html>"; // since this is not even XML compliant - let's just prepend
        var jtPrintIndent = "";
        var jtPrintNewline = "";

        var jtNewElement = function() {
            return {tag: null, attributes: null, children: null, text: null};
        };

        // this regex implies that elements declare in this order: ID, class(es), attribute(s), like: div#anId.aClz[anAttr]
        var jtElementRegex = /^(\w+)(#\w+)?(\.[\-\w\.]+)*(\[\S+\])*$/;

        // helper/template methods
        //var forEachTemplate =

        // PRINTING MARKUP AS HTML
        // once we have converted our json to "markup", we can not "print" to DOM using document.createElement, etc
        var jtMarkupToDom = function(elem) {
            // todo
        };

        // once we have converted our json to "markup", we can not "print" to a string
        var jtMarkupToString = function(elem, ind) {
            // elems are {tag:, attributes:, children:, text:, parent:}

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
                if ( isObject(val) ) {
                    parent.attributes = parent.attributes || {};
                    extend(parent.attributes, val);
                } // discard any other odd values
            } else if ( parent && (name === "children" || name === "C") ) {
                if ( isArray(val) ) {
                    for( i = 0; i < val.length; i++ ) {
                        jtItem(val[i], parent);
                    }
                }
            } else if ( parent && name === "text" ) {
                parent.text = val;
            } else if ( parent && (name === "id" || name === "#") ) {
                parent.attributes.id = val;
            } else if ( parent && (name === "class" || name === ".") ) {
                parent.attributes["class"] = (parent.attributes["class"] ? parent.attributes["class"] + " " + val : val);
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
                ret = extend(jtNewElement(), {children: ret});
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
            var item = null;

            // first, put model into current scope
            if ( model && !Jeff.Utils.isObject(model) ) {
                eval("model = " + model + ";");
            }
            if ( Jeff.Utils.isObject(model) && !Jeff.Utils.isEmptyObject(model) ) {
                for( var prop in model ) {
                    eval("var " + prop + " = model[\"" + prop + "\"];");
                }
            }
            try {
                eval("item = " + str + ";");
            } catch (e) {
                console.log("Error parsing JSON");
            }
            return item;
        };

        return {
            jsonItemToMarkupString: function(item) {
                return jtMarkupToString(jtItem(item));
            },
            jsonStringToMarkupString: function(str, model) {
                return Jeff.VM.jsonItemToMarkupString(jsonStringToJsonItem(str, model));
            },
            jsonItemToMarkupStringPretty: function(item) {
                jtPrintIndent = "  "; jtPrintNewline = "\n";
                return jtMarkupToString(jtItem(item));
            },
            jsonStringToMarkupStringPretty: function(str, model) {
                return Jeff.VM.jsonItemToMarkupStringPretty(jsonStringToJsonItem(str, model));
            },
            jsonItemToMarkupDom: function(item) {
                return jtMarkupToDom(jtItem(item));
            },
            jsonStringToMarkupDom: function(str, model) {
                return Jeff.VM.jsonStringToMarkupDom(jsonStringToJsonItem(str, model));
            }
        };
    }());

    Jeff.compile = function(input, options) {
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

            var ret;
            if ( options && options.prettyPrint ) {
                ret = Jeff.VM.jsonStringToMarkupStringPretty(templateSpec, context);
            } else {
                ret = Jeff.VM.jsonStringToMarkupString(templateSpec, context);
            }

            return ret;
        };
    };


// END(BROWSER)

    return Jeff;

};