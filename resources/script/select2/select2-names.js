/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $, window, document */


function _namesFormatResult(term, container, query) {
    "use strict";
    var markup, type, regex, value, sources, i, j, rowspan;

    var id = term.uuid;
    if (id === undefined) {
        id = term.id;
    }

    type = termIcon(term.type);

    if (term.mainHeadings !== undefined) {
        if (Array.isArray(term.mainHeadings.term)) {
            rowspan = term.mainHeadings.term.length;
        } else {
            rowspan = 2;
        }
    } else {
        rowspan = 1;
    }

    //console.log('namesFormatResult:  Query: ', query);
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
        markup +=           "<i class='tooltip-popup term-related fa fa-info-circle fa-lg' title='VIAF-ID: " + term.id + "'></i>";
    } else if (term.source === 'viaf' && term.mainHeadings !== undefined && term.mainHeadings.term !== undefined) {
        markup +=           "<i class='tooltip-popup term-related fa fa-info-circle fa-lg' title=''></i>";
    }
    markup +=           "</div>";
    markup +=       "</td>";
    markup +=   "</tr>";
    markup +=   "<tr>";
    markup +=       "<td>";
    if ((term.authority === 'local' && term.id !== "" && (term.sources !== undefined && term.sources.indexOf("viaf") > -1)) || term.authority === 'viaf') {
        markup += "&nbsp;<span class='link'>";
        markup += "<a target='_blank' onmouseup='openLink(this);' href='http://www.viaf.org/" + term.id + "' title='Open in Viaf'>" + term.id + "</a>";
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
                            markup +=   '<img src="/exist/apps/rosids-shared/resources/images/repositories/' + sources[j] + '.png" title="' + sources[j] + '" alt="' + sources[j] + '"/>';
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
                        markup +=   '<img src="/exist/apps/rosids-shared/resources/images/repositories/' + sources[j] + '.png" title="' + sources[j] + '" alt="' + sources[j] + '"/>';
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

function initNamesAutocomplete(autoComplete, parentNode) {
    autoComplete.select2({
        name: 'names',
        placeholder: "Search for a name",
        minimumInputLength: 3,
        formatResult: _namesFormatResult,
        formatSelection: termFormatSelection,
        formatNoMatches: "<div>No matches</div>",
        dropdownCssClass: "bigdrop",
        allowClear: true,
        
        createSearchChoice: function (term) { 
            return { "id" : "-1", "type" : "unknown", "value" : "Add new entry.", "authority" : "", "sources" : "", "source" : "" }; },
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
                    type: 'names',
                    query: term,
                    page_limit: 10,
                    collections: parentNode.prop('data-collections'),
                    page: page,
                    exact_mode: $(parentNode).find('#Name-exact').is(":checked"),
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
        $('#' + e.val + ' .tooltip-popup').tooltip({
            content: function () {
                return $('#tooltip-' + e.val).html();
            }
        });
        /*
        $('#' + e.val + ' .link').on('mouseup', function (f) {
            f.stopPropagation();
            var url = $(f.target).attr('href');
            var win = window.open(url, '_blank');
            win.focus();
        });
        */
    });
}
