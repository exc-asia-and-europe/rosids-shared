/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $, window, document */

var config = {
    "host": "http://example.com:77777"
};

var autocompletes = {};
function openLink(that) {
    "use strict";

    var url = $(that).attr('href');
    var win = window.open(url, '_blank');
    win.focus();
}
;

function escapeRegExp(str) {
    "use strict";
    if (str !== undefined) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
    return ""
}
;

function termIcon(type) {
    "use strict";
    var icon = 'question';
    if (type === 'personal') {
        icon = 'user';
    } else if (type === 'corporate') {
        icon = 'globe';
    } else if (type === 'subjects') {
        icon = 'bookmark';
    } else if (type === 'materials' || type === 'techniques' || type === 'worktypes') {
        icon = 'paint-brush';
    } else if (type === 'styleperiods') {
        icon = 'clock-o';
    } else if (type === 'geographic') {
        icon = 'location-arrow';
    }
    return icon;
}


function termFormatSelection(term) {
    "use strict";
    return term.value;
}

function initAutocompletes() {
    "use strict";

    $(".xfRepeatItem [name$=-autocomplete-input]").each(function () {
        var autoComplete, parentNode, xfRoot, multiple, name, xfId, autoCompleteID, queryType, targetID;

        autoComplete = $(this);

        parentNode = $(autoComplete.parent('span[data-name = "autocomplete"]').parent('span[data-name$= "-autocomplete"]'));
        xfRoot = parentNode.parent('.xfContainer');
        if (xfRoot.length === 0) {
            xfRoot = parentNode.parent('.xfRepeatItem');
        }
        //NAMES: data-queryType="names"

        multiple = parentNode.attr('data-multiple');
        name = autoComplete.attr('name');
        xfId = xfRoot.attr('id');
        autoCompleteID = xfId + 'AC';

        if (xfRoot.length !== 0) {
            if (autocompletes[autoCompleteID] === undefined) {
                var xformsValueNode, xformsValueClass;

                if (multiple !== undefined && multiple === 'true') {
                    initMultipleRepositories(parentNode, xfId);
                }

                xformsValueClass = '.' + autoComplete.attr('data-name') + ' .xfValue';
                xformsValueNode = xfRoot.find('.' + autoComplete.attr('data-name') + ' .xfValue');

                //console.log("JQUERY-VALUE: ", xformsValueNode.val());
                //console.log("DOJO-VALUE: ", dojo.attr(dojo.byId(xformsValueNode.attr('id')), 'value'));

                //Set input to xforms value
                autoComplete.val(xformsValueNode.val());
                //Get xforms-input-id
                targetID = xfRoot.find('.' + autoComplete.attr('data-name')).attr('id');
                //Get query type
                queryType = autoComplete.attr('data-queryType');

                if (!(autoComplete.hasClass('select2-container'))) {
                    autoComplete.attr('targetid', targetID);
                    autoComplete.attr('id', autoCompleteID);

                    switch (queryType) {
                        case 'names':
                            initNamesAutocomplete(autoComplete, parentNode);
                            break;
                        case 'geographic':
                        case 'subjects':
                        case 'materials':
                        case 'styleperiods':
                        case 'techniques':
                        case 'worktypes':
                            initSubjectsAutocomplete(autoComplete, parentNode, queryType);
                            break;
                        default:
                    }
                }
                autocompletes[autoCompleteID] = autoComplete;
            }
        }
    });
}
;


function destroyAutocompletes() {
    "use strict";
    var key;
    //console.log("DESTROY");
    for (key in autocompletes) {
        if (autocompletes.hasOwnProperty(key)) {
            if (autocompletes[key] !== undefined) {
                console.log('#' + key);
                $('#' + key).select2('destroy');
            }
        }
    }

    autocompletes = {};
}

function clearAndInitAutocompletes() {
    "use strict";
    destroyAutocompletes();
    initAutocompletes();
}

$(document).ready(function () {
    "use strict";
    Flux.getInstanceDocument('m-main', 'i-user', fluxProcessor.sessionKey, initModel);
});