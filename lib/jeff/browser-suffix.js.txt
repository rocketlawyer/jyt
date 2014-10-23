if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = Jeff;

} else if (typeof define === "function" && define.amd) {
    // AMD modules
    define(function() { return Jeff; });

} else {
    // other, i.e. browser
    this.Jeff = Jeff;
}
}).call(this);