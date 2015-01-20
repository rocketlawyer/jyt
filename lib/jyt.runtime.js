/**
 * Author: Jeff Whelpley
 * Date: 10/27/14
 *
 *
 */
var utils = require('./jyt.utils');
var allTags = ['a', 'iframe', 'abbr', 'acronym', 'address', 'area', 'b', 'base',
    'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'caption', 'cite', 'code',
    'col', 'colgroup', 'dd', 'del', 'dfn', 'div', 'dl', 'dt', 'em', 'fieldset',
    'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'html', 'hr', 'i', 'img',
    'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'map', 'meta', 'noscript',
    'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'q', 's', 'samp', 'script',
    'select', 'small', 'span', 'strong', 'style', 'sub', 'sup', 'table', 'tbody',
    'td', 'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'tt', 'u', 'ul'];
var selfClosing = ['area', 'base', 'basefont', 'br', 'col', 'frame', 'hr',
    'img', 'input', 'link', 'meta', 'param'];

var elems = {};
var naked;

/**
 * Take a jyt element and render it to an HTML string
 * @param elem
 * @param opts
 */
function render(elem, opts) {
    opts = opts || {};

    var prepend = opts.prepend;
    var model = opts.model || {};
    var indentLevel = opts.indentLevel || 0;
    var isPretty = opts.isPretty;
    var jtPrintIndent = isPretty ? '\t' : '';
    var jtPrintNewline = isPretty ? '\n' : '';
    var indent = '', i, len, prop;
    var p = [];  // p is going to be our concatenator for the HTML string

    // if no element, then no HTML so return empty string
    if (!elem) { return ''; }

    // if already a string, just return it
    if (utils.isString(elem)) { return elem; }

    // if an array, wrap it
    if (utils.isArray(elem)) { elem = naked(elem, null); }

    // set the indentation level to the current indent
    if (isPretty && indentLevel) {
        for (i = 0; i < indentLevel; i++) {
            indent += jtPrintIndent;
        }
    }

    // if we are prepending some string, add it first
    if (prepend) {
        p.push(indent, prepend, jtPrintNewline);
    }

    // starting tag open
    if (elem.tag) {
        p.push(indent, '<', elem.tag);
    }

    // all tag attributes
    if (elem.attributes) {
        for (prop in elem.attributes) {
            if (elem.attributes.hasOwnProperty(prop)) {

                if (elem.attributes[prop] === null) {
                    p.push(' ', prop);
                }
                else {
                    p.push(' ', prop, '="', elem.attributes[prop], '"');
                }
            }
        }
    }

    // if no children or text, then close the tag
    if (elem.tag && !elem.children && (elem.text === undefined || elem.text === null)) {

        // for self closing we just close it, else we add the end tag
        if (selfClosing.indexOf(elem.tag) > -1) {
            p.push('/>', jtPrintNewline);
        }
        else {
            p.push('></', elem.tag, '>', jtPrintNewline);
        }
    }
    // else we need to add children or the inner text
    else {

        // if a tag (i.e. not just a string literal) put end bracket
        if (elem.tag) { p.push('>'); }

        // if children, we will need to recurse
        if (elem.children) {
            if (elem.tag) { p.push(jtPrintNewline); }

            // recurse down for each child
            for (i = 0, len = elem.children.length; i < len; ++i) {
                p.push(render(elem.children[i], {
                    indentLevel:    elem.tag ? indentLevel + 1 : indentLevel,
                    isPretty:       isPretty,
                    model:          model
                }));
            }

            if (elem.tag) { p.push(indent); }
        }

        // if text, simply add it
        if (elem.text !== null && elem.text !== undefined) { p.push(elem.text); }

        // finally if a tag, add close tag
        if (elem.tag) {
            p.push('</', elem.tag, '>', jtPrintNewline);
        }
    }

    return p.join('');
}

/**
 * This will convert a tag with attributes, chidlren and text to a jyt object
 * that can later be rendered.
 *      ex. elem('div', attributes, children, text);
 *
 * @param tagName
 * @returns {*}
 */
function elem(tagName) {
    if (!utils.isString(tagName)) {
        return null;
    }

    // element at the very least has name and fn to render itself
    var e = {
        tag:    tagName,
        render: function () { return render(e); }
    };

    // add other values to the element based on the input argument
    if (arguments.length > 1) {
        for (var i = 1, len = arguments.length; i < len; ++i) {
            var arg = arguments[i];

            if (utils.isArray(arg)) {
                if (e.children && e.children.length) {
                    e.children = e.children.concat(arg);
                }
                else {
                    e.children = arg;
                }
            }
            else if (utils.isObject(arg) && arg.hasOwnProperty('tag')) {
                e.children = e.children || [];
                e.children.push(arg);
            }
            else if (utils.isObject(arg) && arg.tag && arg.toString) {
                e.children = [arg];
            }
            else if (utils.isObject(arg)) {
                e.attributes = arg;
            }
            else if (utils.isString(arg)) {
                e.text = arg;
            }
        }
    }

    return e;
}

/**
 * Since an array designates chidlren, we need this in order to identify an
 * array of sibling elements that have no parent.
 *
 * @param elements
 * @param text
 * @returns {*}
 */
naked = function naked(elements, text) {
    return elem('', elements, text);
};

/**
 * Add all elements to the given scope
 * @param scope
 */
function addElemsToScope(scope) {
    var prop;
    for (prop in elems) {
        if (elems.hasOwnProperty(prop)) {
            scope[prop] = elems[prop];
        }
    }
    scope.elem = elem;
}

/**
 * Given a tag name, create an element function
 * @param tagName
 * @returns {Function}
 */
function makeElem(tagName) {
    return function () {
        [].unshift.call(arguments, tagName);
        return elem.apply(this, arguments);
    };
}

/**
 * Create functions for all standard HTML element
 */
function init() {
    var tagName;
    for (var i = 0; i < allTags.length; i++) {
        tagName = allTags[i];
        elems[tagName] = makeElem(tagName);
    }
}

// expose all functions for resting purposes (jyt.js limits exposure to outside world)
module.exports = {
    elems: elems,
    render: render,
    elem: elem,
    naked: naked,
    addElemsToScope: addElemsToScope,
    makeElem: makeElem,
    init: init
};
