/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $, window, document */

var autocompletes = {};

var config = {
    "host": "http://localhost:8080"
};




/* GLOBAL+CUSTOM helper functions */
function formatRepositories(repo) {
    "use strict";
    var markup, type;

    if (repo.repotype === 'user') {
        type = 'user';
    } else if (repo.repotype === 'global') {
        type = 'university';
    } else if (repo.repotype === 'group') {
        type = 'group';
    } else if (repo.repotype === 'custom') {
        type = 'angle-double-right';
    }

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


function termFormatResult(term, container, query) {
    "use strict";
    var markup, type, regex, value, relatedTerms, sources, i;


    type = 'question';
    if (term.type === 'personal') {
        type = 'user';
    } else if (term.type === 'corporate') {
        type = 'globe';
    } else if (term.type === 'subject') {
        type = 'bookmark';
    }

    regex = new RegExp(query.term, 'gi');
    value = term.value.replace(regex, function (match) { return '<b>' + match + '</b>'; });

    markup = "<table class='term-result'>";
    markup +=   "<tr>";
    markup +=       "<td class='term-info'>";
    markup +=           "<div class='term-term'>";
    markup +=               "<span class='term-type'><i class='fa fa-" + type + "'></i></span>";
    markup +=               "<span class='term-value>'";
    markup +=               "<p>" + value + "</p>";
    if (term.bio !== undefined) {
        markup +=           "<span class='term-bio'> (" + term.bio + ") </span>";
    }
    if (term.relatedTerms !== undefined) {
        //TODO: highlight matches in tooltip!
        relatedTerms = term.relatedTerms.replace(regex, function (match) {return '&lt;b&gt;' + match + '&lt;/b&gt;'; });
        //markup += "<i class='term-related fa fa-info-circle fa-lg' title='"+ relatedTerms + "'></i>";
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
    markup += "</table>";

    return markup;
}

function termFormatSelection(term) {
    "use strict";
    return term.value;
}

function initAutocompletes() {
    "use strict";
    //console.log("initAutocompletes()");
    //console.log("initAutocompletes(): ", autocompletes);

    $(".xfRepeatItem [name$=-autocomplete-input]").each(function () {
        var autocompleteInput, autocompleteGroup, xfRoot, name, multiple, key, globalSelect, xfValue, queryType;
        autocompleteInput = $(this);
        autocompleteGroup = $(autocompleteInput.parent('span[data-name = "autocomplete"]').parent('span[data-name$= "-autocomplete"]'));

        xfRoot = autocompleteGroup.parent('.xfContainer');
        if (xfRoot.length === 0) {
            xfRoot = autocompleteGroup.parent('.xfRepeatItem');
        }

        name = autocompleteInput.attr('name');
        multiple = autocompleteGroup.attr('data-multiple');
        key = xfRoot.attr('id');

        if (xfRoot.length !== 0) {
            if (autocompletes[key] === undefined) {
                //Save autocompleteGroup for later
                autocompletes[key] = autocompleteGroup;

                if(multiple != undefined && multiple === 'true') {
                    /* GLOBAL  + CUSTOM Selects*/
                    globalSelect = autocompleteGroup.find('input[name = "global-select"]');

                    $.ajax({
                        url: config.host + '/exist/apps/rosids-shared/modules/repositories/repositories.xq',
                        dataType: 'json',
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
                                    var customSelect = autocompleteGroup.find('input[name = "custom-select"]');
                                    if (e.added.id === '-1') {
                                        $.ajax({
                                            url: config.host + "/exist/apps/rosids-shared/modules/repositories/repositories.xq?group=custom",
                                            dataType: "json",
                                            crossDomain: true,
                                            success: function (data) {
                                                var customOptions;

                                                if (Array.isArray(data.repository)) {
                                                    customOptions =  data.repository;
                                                } else {
                                                    customOptions = [data.repository];
                                                }

                                                customSelect.attr('value', customOptions[0].id);
                                                autocompleteGroup.prop('data-collections', customOptions[0].collection);
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
                                                    autocompleteGroup.prop('data-collections', e.added.collection);
                                                    //console.log(autocompleteGroup.prop('data-collections') + ":" + autocompletes[key].prop('data-collections'));
                                                });
                                                autocompleteGroup.find('span[data-name = "custom"]').show();
                                            }
                                        });
                                    } else {
                                        autocompleteGroup.find('span[data-name = "custom"]').hide();

                                        $.each(customSelect.find('option'), function (index, value) {
                                            $(value).remove();
                                        });
                                        customSelect.select2("destroy");
                                        autocompleteGroup.prop('data-collections', e.added.collection);
                                    }
                                });

                                //console.log("GlobalGroup: " + autocompleteGroup.find('span[name = "global"]'));
                                autocompleteGroup.find('span[data-name = "global"]').show();
                            }
                        }
                    });
                }
                xfValue = xfRoot.find('.' + autocompleteInput.attr('data-name') + ' .xfValue');
                //console.log("xfValue: ", xfValue, " Value: ", xfValue.val());


                //Set input ot xforms value
                autocompleteInput.val(xfValue.val());
                queryType = autocompleteInput.attr('data-queryType');

                if (!(autocompleteInput.hasClass('select2-container'))) {
                    autocompleteInput.select2({
                        name: queryType,
                        placeholder: "Search for a term",
                        minimumInputLength: 3,
                        formatResult: termFormatResult,
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
                                    collections: autocompleteGroup.prop('data-collections'),
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
                        var target, object, uuid, refid;
                        target = $(e.target);
                        if ("" === e.val) {
                            fluxProcessor.dispatchEventType(target.attr('key'), 'autocomplete-callback', {
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

                                fluxProcessor.dispatchEventType(target.attr('key'), 'autocomplete-callback', {
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
                    });
                }


                autocompleteInput.attr('key', key);
                autocompletes[key] = autocompleteInput;
                //console.log("initAutocompletes(): " , autocompletes);
                //console.log("initAutocompletes(): " , autocompletes[key]);
            } else {
                //console.log("initAutocompletes(): ignore already initalized autocomplete element");
            }
        } else {
            //console.log("initAutocompletes(): ignore parentless element");
        }
    });


}

function clearAndInitAutocompletes() {
    "use strict";
    //console.log("clearAndInitAutocompletes()");
    var key, autocompleteGroup;

    for (key in autocompletes) {
        if (autocompletes.hasOwnProperty(key)) {
            autocompleteGroup = autocompletes[key];
            if (autocompleteGroup.find('input[name = "global-select"]') !== undefined) {
                autocompleteGroup.find('input[name = "global-select"]').select2('destroy');
            }
            if (autocompleteGroup.find('input[name = "custom-select"]') !== undefined) {
                autocompleteGroup.find('input[name = "custom-select"]').select2('destroy');
            }
            if (autocompleteGroup.find('input[name$="-autocomplete-input"]') !== undefined) {
                autocompleteGroup.find('input[name$="-autocomplete-input"]').select2('destroy');
            }
        }
    }

    autocompletes = {};
    initAutocompletes();
}