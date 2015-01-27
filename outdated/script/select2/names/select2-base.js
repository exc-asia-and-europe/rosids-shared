/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $, window, document */

var config = {
    "host": "http://kjc-sv013.kjc.uni-heidelberg.de:48080"
};

function escapeRegExp(str) {
    "use strict";
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function termFormatSelection(term) {
    "use strict";
    return term.value;
}