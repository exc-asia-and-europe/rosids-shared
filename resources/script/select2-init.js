/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $, window, document */

var autocompletes = {};
var model = {};

var config = {
    "host": "http://localhost:8080"
};

function escapeRegExp(str) {
    "use strict";
    if(str !== undefined) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
    
    return ""
}

/* GLOBAL+CUSTOM helper functions */
function formatRepositories(repo) {
    "use strict";
    var markup, type;

    type = _repoIcon(repo.repotype);

    markup = '<table class="term-result">';
    markup +=   '<tr>';
    markup +=       '<td class="term-info">';
    markup +=           '<div class="term-term term-origin">';
    if (type !== undefined) {
        markup +=           '<span class="term-type"><i class="fa fa-' + type + '"></i></span>';
    } else {
        markup +=           '<span class="term-authority img_' + repo.icon + '"></span>';
    }
    markup +=               '<span class="term-value">';
    markup +=                   repo.name;
    markup +=               '</span>';
    markup +=           '</div>';
    markup +=       '</td>';
    markup +=   '</tr>';
    markup += '</table>';
    return markup;
}

function formatRepositoriesSelection(repo) {
    "use strict";
    var markup, type;

    type = _repoIcon(repo.repotype);

    markup = "<span>";
    if (type !== undefined) {
        markup +=           '<span class="term-type"><i class="fa fa-' + type + '"></i></span>';
    } else {
        markup +=           '<span class="term-authority img_' + repo.icon + '"></span>';
    }
    markup += "<span class='term-value'>" + repo.name + "</span>";
    markup += "</span>";

    return markup;
}


function termFormatResult(term, container, query) {
    "use strict";
    var markup, type, regex, value, relatedTerms, sources, i;


    type = _termIcon(term.type);

    console.log('Query: ', query);
    regex = new RegExp(escapeRegExp(query.term), 'gi');
    value = term.value.replace(regex, function (match) { return '<b class="select2-match">' + match + '</b>'; });

    markup = "<table class='term-result'>";
    markup +=   "<tr>";
    markup +=       "<td class='term-info'>";
    markup +=           "<div class='term-term'>";
    markup +=               "<span class='term-type'><i class='fa fa-" + type + "'></i></span>";
    markup +=               "<span class='term-value'";
    markup +=               ">" + value;
    if (term.bio !== undefined) {
        markup +=           "<span class='term-bio'> (" + term.bio + ") </span>";
    }
    if (term.relatedTerms !== undefined) {        
        relatedTerms = term.relatedTerms.replace(regex, function (match) {return '&lt;b&gt;' + match + '&lt;/b&gt;'; });
        markup +=               "<i class='term-related fa fa-info-circle fa-lg' title='&lt;span&gt;" + relatedTerms + "&lt;/span&gt;'></i>";
    }
    markup +=               "</span>";
    markup +=           "</div>";

    markup +=           "<div class='term-origin'>";
    markup +=               "<span class='term-authority img_" + term.icon + "'></span>";
    if (term.sources !== undefined && term.source !== '') {
        sources = [];
        sources = term.sources.split(/\b\s+/);
        markup +=           "<span class='term-sources'>";

        for (i = 0; i < sources.length; i++) {
            if (sources[i] !== term.authority) {
                markup +=   '<span class="img_' + sources[i] + '"></span>';
            }
        }
        markup +=           "</span>";
    }
    markup +=           "</div>";
    markup +=       "</td>";
    markup +=   "</tr>";
    markup +=   "<tr>";
    markup +=   "</tr>";
    markup += "</table>";
    
    /* TODO*/
    /*
    if (term.relatedTerms !== undefined) {
        var relTerms = term.relatedTerms
        markup += "<div style='display:none' id='tooltip-" + id + "'>";
        markup +=       "<div>";
        markup +=           "<table>";
        for(j = 0; j < sources.length; j++))
        markup +=               "<tr>";
        markup +=               "<td>" + relterm;
        markup +=               "</td>";
        markup +=               "</tr>";
        markup +=           "</table>";
        markup +=       "</div>";
        markup += "</div>";
    */

    return markup;
}

function termFormatSelection(term) {
    "use strict";
    return term.value;
}

function _initRepositories(parentNode, parentId) {
    "use strict";
    var globalSelect;
    
    globalSelect = parentNode.find('input[name = "global-select"]');

    $.ajax({
        url: config.host + '/exist/apps/rosids-shared/modules/ziziphus/repositories/repositories.xq',
        dataType: 'json',
        data: model,
        crossDomain: true,
        success: function (data) {
            var globalOptions = data.repository;

            if (Array.isArray(data.repository) && data.repository.length > 1) {
                globalSelect.select2({
                    minimumResultsForSearch: -1,
                    formatResult: formatRepositories,
                    formatSelection: formatRepositories,
                    escapeMarkup: function (m) { return m; },
                    data: {
                        results: globalOptions,
                        text: 'name'
                    }
                }).on('change', function (e) {
                    var customSelect = parentNode.find('input[name = "custom-select"]');
                    if (e.added.id === '-1') {
                        $.ajax({
                            url: config.host + "/exist/apps/rosids-shared/modules/ziziphus/repositories/repositories.xq?category=custom",
                            dataType: "json",
                            crossDomain: true,
                            data: model,
                            success: function (data) {
                                var customOptions;

                                if (Array.isArray(data.repository)) {
                                    customOptions =  data.repository;
                                } else {
                                    customOptions = [data.repository];
                                }

                                customSelect.attr('value', customOptions[0].id);
                                parentNode.prop('data-collections', customOptions[0].collection);
                                //console.log(autocompleteGroup.prop('data-collections'));

                                customSelect.select2({
                                    minimumResultsForSearch: -1,
                                    formatResult: formatRepositories,
                                    formatSelection: formatRepositories,
                                    placeholderOption: 'first',
                                    escapeMarkup: function (m) { return m; },
                                    data: {
                                        results: customOptions,
                                        text: 'name'
                                    }
                                }).on('change', function (e) {
                                    parentNode.prop('data-collections', e.added.collection);
                                    //console.log(autocompleteGroup.prop('data-collections') + ":" + autocompletes[key].prop('data-collections'));
                                });
                                parentNode.find('span[data-name = "custom"]').show();
                            }
                        });
                        //Save CustomSelect so we can destroy it later    
                        customSelect.attr('id', parentId + 'CS');
                        autocompletes[parentId + 'CS'] = customSelect;
                    } else {
                        parentNode.find('span[data-name = "custom"]').hide();

                        $.each(customSelect.find('option'), function (index, value) {
                            $(value).remove();
                        });
                        parentNode.prop('data-collections', e.added.collection);
                        
                        customSelect.select2("destroy");
                        //Remove customeSelect from registry as it is allready destroyed
                        autocompletes[parentId + 'CS'] = undefined;
                    }
                });
                parentNode.find('span[data-name = "global"]').show();

                //Save GlobalSelect so we can destroy it later
                globalSelect.attr('id', parentId + 'GS');
                autocompletes[parentId + 'GS'] = globalSelect;
            }
        }
    });
}


function initAutocompletes() {
    "use strict";

    $(".xfRepeatItem [name$=-autocomplete-input]").each(function () {
        var autocompleteInput, parentNode, xformsRoot, multipleRepositories, name, parentId, myId, queryType, targetid;
        
        /* Grabs node needed to gather information */
        autocompleteInput = $(this);
        parentNode = $(autocompleteInput.parent('span[data-name = "autocomplete"]').parent('span[data-name$= "-autocomplete"]'));
        xformsRoot = parentNode.parent('.xfContainer');
        if (xformsRoot.length === 0) {
            xformsRoot = parentNode.parent('.xfRepeatItem');
        }

        multipleRepositories = parentNode.attr('data-multiple');
        name = autocompleteInput.attr('name');
        parentId = xformsRoot.attr('id');
        myId = parentId + 'AC';

        if (xformsRoot.length !== 0) {
            if (autocompletes[myId] === undefined) {
                var xformsValueNode, xformsValueClass;
                
                if (multipleRepositories !== undefined && multipleRepositories === 'true') {
                    _initRepositories(parentNode, parentId);
                }
                
                //Get xforms node which holds current value
                xformsValueClass = '.' + autocompleteInput.attr('data-name') + ' .xfValue';
                xformsValueNode = xformsRoot.find('.' + autocompleteInput.attr('data-name') + ' .xfValue');
                
                console.log("JQUERY-VALUE: ", xformsValueNode.val());
                console.log("DOJO-VALUE: ", dojo.attr(dojo.byId(xformsValueNode.attr('id')), 'value'));
                
                //Set input to xforms value
                autocompleteInput.val(xformsValueNode.val());
                //Get xforms-input-id
                targetid = xformsRoot.find('.' + autocompleteInput.attr('data-name')).attr('id');
                //Get query type
                queryType = autocompleteInput.attr('data-queryType');

                if (!(autocompleteInput.hasClass('select2-container'))) {
                    autocompleteInput.attr('targetid', targetid);
                    autocompleteInput.attr('id', myId);

                    autocompleteInput.select2({
                        name: queryType,
                        placeholder: "Search for a term",
                        minimumInputLength: 3,
                        formatResult: namesFormatResult,
                        /*
                        function(term, container, query) {
                            if(queryType === 'names') {
                                namesFormatResult(term, container, query)
                            } else {
                                termFormatResult(term, container, query) 
                            }
                        },
                        */
                        formatSelection: termFormatSelection,
                        formatNoMatches: "<div>No matches</div>",
                        dropdownCssClass: "bigdrop",
                        allowClear: true,
                        createSearchChoice: function (term) { return { "id" : "-1", "type" : "unknown", "value" : "Add new entry.", "authority" : "", "sources" : "", "source" : "" }; },
                        id: function (object) {
                            var uuid, id;
                            uuid = object.uuid;
                            if (uuid !== undefined) {
                                id = object.uuid;
                            } else {
                                id = object.id;
                            }
                            return id;
                        },
                        escapeMarkup: function (m) {
                            return m;
                        },
                        initSelection: function (element, callback) {
                            //console.log("iniSelection: " + $(element).val());
                            //TODO: create service and check entries!!!!
                            var term = $(element).val();
                            callback({value: term});
                        },
                        ajax: {
                            url: config.host + "/exist/apps/rosids-services/modules/services/search/suggest.xq",
                            dataType: "json",
                            crossDomain: true,
                            data: function (term, page) {
                                return {
                                    type: queryType,
                                    query: term,
                                    page_limit: 10,
                                    collections: parentNode.prop('data-collections'),
                                    page: page
                                };
                            },
                            results: function (data, page) {
                                var more = (page * 10) < data.total;

                                if (parseInt(data.total, 10) === 0) {
                                    return {results: []};
                                }

                                if (Array.isArray(data.term)) {
                                    return {results: data.term, more: more};
                                } else {
                                    return { results: [data.term], more: more};
                                }
                            }
                        }
                    }).on('change', function (e) {
                        //console.log(e.object);
                        var target, object, uuid, refid, targetid;
                        target = $(e.target);
                        targetid = target.attr('targetid');

                        if ("" === e.val) {
                            fluxProcessor.dispatchEventType(targetid, 'autocomplete-callback', {
                                termValue: "",
                                refid: "",
                                earliestDate: "",
                                latestDate: "",
                                authority: "",
                                source: "",
                                termType: ""
                            });
                        } else if ("-1" === e.val) {
                            alert("To be implemented ...");
                        } else {
                            object = null;
                            if (e.added !== undefined) {
                                object = e.added;
                            }
                            if (object !== null) {
                                uuid = object.uuid;
                                if (uuid !== undefined) {
                                    refid = object.uuid;
                                } else {
                                    refid = object.id;
                                }

                                fluxProcessor.dispatchEventType(targetid, 'autocomplete-callback', {
                                    termValue: object.value,
                                    refid: refid,
                                    earliestDate: object.earliestDate,
                                    latestDate: object.latestDate,
                                    authority: object.authority,
                                    source: object.source,
                                    termType: object.type
                                });
                            }
                        }
                    }).on('select2-highlight', function (e) {
                        $('#' + e.val + ' .tooltip').tooltip({
                            content: function () {
                                return $('#tooltip-' + e.val).html();
                            }
                        });
                        $('#' + e.val + ' .link').on('mouseup', function (f) {
                            f.stopPropagation();
                            var url = $(f.target).attr('href');
                            var win = window.open(url, '_blank');
                            win.focus();
                        });
                    });
                }
                
                autocompletes[myId] = autocompleteInput;
            } else {
                //console.log("initAutocompletes(): ignore already initalized autocomplete element");
            }                        
        } else {
            //console.log("initAutocompletes(): ignore parentless element");
        }
    });


}

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

function init(data) {
    "use strict";
    model['user'] = data.querySelector('user').innerHTML;
    model['groups'] = data.querySelector('groups').innerHTML;
}

$(document).ready(function () {
    "use strict";
    Flux.getInstanceDocument('m-main', 'i-user', fluxProcessor.sessionKey, init);
});



function formatResult(term, container, query) {
    console.log("TERM: ", term);
    console.log("CONTAINER: ", container);
    console.log("QUERY: ", query);
}


/* NEW */
/* NEW */
/* NEW */

function namesFormatResult(term, container, query) {
    "use strict";
    var markup, type, regex, value, sources, i, j, rowspan;

    var id = term.uuid;
    if (id === undefined) {
        id = term.id;
    }

    type = _termIcon(term.type);

    if (term.mainHeadings !== undefined) {
        if (Array.isArray(term.mainHeadings.term)) {
            rowspan = term.mainHeadings.term.length;
        } else {
            rowspan = 2;
        }
    } else {
        rowspan = 1;
    }

    console.log('namesFormatResult:  Query: ', query);
    regex = new RegExp(escapeRegExp(query.term), 'gi');
    value = term.value.replace(regex, function (match) { return '<b class="select2-match">' + match + '</b>'; });

    markup = "<table id='" + id + "' class='term-result'>";
    markup +=   "<tr>";
    markup +=       "<td class='term-info'>";
    markup +=           "<div class='term-term'>";
    markup +=               "<span class='term-type'><i class='fa fa-" + type + "'></i></span>";
    markup +=               "<span class='term-value'>" + value + "<span>";
    if (term.bio !== undefined) {
        markup +=           "&nbsp;<span class='term-bio'>" + term.bio + "</span>";
    }
    if (term.authority !== "") {
        markup +=               "&nbsp;<span><img src='../rosids-shared/resources/images/repositories/" + term.authority + ".png' title='" + term.authority + "' alt='" + term.authority + "'/></span>";
    }
    
    if (term.authority === 'local' && term.id !== "" && (term.sources !== undefined && term.sources.indexOf("viaf") > -1)) {
        markup +=           "<i class='tooltip term-related fa fa-info-circle fa-lg' title='VIAF-ID: " + term.id + "'></i>";
    } else if (term.authority === 'viaf' && term.mainHeadings !== undefined && term.mainHeadings.term !== undefined) {
        markup +=           "<i class='tooltip term-related fa fa-info-circle fa-lg' title=''></i>";
    }
    markup +=           "</div>";
    markup +=       "</td>";
    markup +=   "</tr>";
    markup +=   "<tr>";
    markup +=       "<td>";
    if ((term.authority === 'local' && term.id !== "" && (term.sources !== undefined && term.sources.indexOf("viaf") > -1)) || term.authority === 'viaf') {
        markup += "&nbsp;<span class='link'>";
        markup += "<a target='_blank' href='http://www.viaf.org/" + term.id + "' title='Open in Viaf'>" + term.id + "</a>";
        markup += "</span>";
    }
    markup +=       "</td>";
    markup +=   "</tr>";
    markup += "</table>";
    if (term.mainHeadings !== undefined && term.mainHeadings.term !== undefined) {
        markup += "<div style='display:none' id='tooltip-" + id + "'>";
        markup +=       "<div>";
        markup +=       "<table>";
        if (Array.isArray(term.mainHeadings.term)) {
            for (i = 0; i < term.mainHeadings.term.length; i++) {
                markup +=       "<tr>";
                markup +=           "<td>" + term.mainHeadings.term[i].value + "</td>";
                
                markup +=       "</tr>";
                if (term.mainHeadings.term[i].sources !== undefined && term.mainHeadings.term[i].sources !== '') {
                    markup +=       "<tr>";
                    markup +=           "<td>";
                    
                    sources = [];
                    sources = term.mainHeadings.term[i].sources.split(/\b\s+/);
                    for (j = 0; j < sources.length; j++) {
                        if (sources[j] !== '') {
                            markup +=   '<img src="../resources/images/repositories/' + sources[j] + '.png" title="' + sources[j] + '" alt="' + sources[j] + '"/>';
                        }
                    }
                    markup +=           "</td>";
                    markup +=       "</tr>";
                }
            }
        } else {
            markup +=       "<tr>";
            markup +=           "<td>" + term.mainHeadings.term.value + "</td>";
            markup +=       "</tr>";
            if (term.mainHeadings.term.sources !== undefined && term.mainHeadings.term.sources !== '') {
                markup +=       "<tr>";
                markup +=           "<td>";
                sources = [];
                sources = term.mainHeadings.term.sources.split(/\b\s+/);
                for (j = 0; j < sources.length; j++) {
                    if (sources[j] !== '') {
                        markup +=   '<img src="../resources/images/repositories/' + sources[j] + '.png" title="' + sources[j] + '" alt="' + sources[j] + '"/>';
                    }
                }
                markup +=           "</td>";
                markup +=       "</tr>";
            }
        }
        markup +=       "</table>";
        markup +=       "</div>";
        markup += "</div>";
    }
    return markup;
}


function _termIcon(type) {
    "use strict";
    var icon = 'question';
    if (type === 'personal') {
        icon = 'user';
    } else if (type === 'corporate') {
        icon = 'globe';
    } else if (type === 'subject') {
        icon = 'bookmark';
    } else if (type === 'materials' || type === 'techniques' || type === 'worktypes') {
        icon = 'paint-brush';
    } else if (type === 'styleperiods') {
        icon = 'clock-o';
    }
    return icon;
}

function _repoIcon(repotype) {
    "use strict";
    var icon = 'question';
    if (repotype === 'user') {
        icon = 'user';
    } else if (repotype === 'global') {
        icon = 'university';
    } else if (repotype === 'group') {
        icon = 'group';
    } else if (repotype === 'custom') {
        icon = 'angle-double-right';
    }
    return icon;
}


