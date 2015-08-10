/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $, window, document */

function _subjectsFormatResult(term, container, query) {
    "use strict";
    var markup, type, regex, value, relatedTerms, sources, i;


    var id = term.id;
    if (id === undefined) {
        id = term.uuid;
    }

    type = termIcon(term.type);

    //console.log('Query: ', query);
    regex = new RegExp(escapeRegExp(query.term), 'gi');
    value = term.value.replace(regex, function (match) {
        return '<b class="select2-match">' + match + '</b>';
    });

    if (term.id === "-1") {
        markup = "<table id='" + id + "' class='term-result'>";
        markup += "<tr>";
        markup += "<td class='term-info'>";
        markup += "<div class='term-term'>";
        markup += "<span class='term-type'><i class='fa fa-" + type + "'></i></span>";
        markup += "<span class='term-value'>"
        markup += "<span class='link'>";
        if (term.source === 'geographic') {
            markup += "<a target='_blank' onmouseup='openLink(this);' href='https://docs.google.com/forms/d/1X44GZ4Lk0WfO6Vp1M2UnOmiZF3V7tabLH39bj12YSKU/viewform' title='Add new Agent'>Add new location</a>";
        }
        else {
            markup += "<a target='_blank' onmouseup='openLink(this);' href='https://docs.google.com/forms/d/111b2k3IQeVuJhk0NXsgdsokw-wexk5BjKmcJLF5jVeE/viewform' title='Add new Agent'>Add new subject</a>";
        }
        markup += "</span>";
        markup += "</span>";
        markup += "</div>";
        markup += "</td>";
        markup += "</tr>";
        markup += "</table>";
    } else {
        markup = "<table id='" + id + "' class='term-result'>";
        markup += "<tr>";
        markup += "<td class='term-info'>";
        markup += "<div class='term-term'>";
        markup += "<span class='term-type'><i class='fa fa-" + type + "'></i></span>";
        markup += "<span class='term-value'>" + value;
        if (term.qualifiers !== undefined && term.qualifiers !== '') {
            markup += " (" + term.qualifiers + ")"
        }
        markup += "</span>"
        if (term.authority !== "") {
            markup += "&nbsp;<span><img src='../rosids-shared/resources/images/repositories/" + term.authority + ".png' title='" + term.authority + "' alt='" + term.authority + "'/></span>";
        }
        if (Array.isArray(term.descriptiveNote) || term.relatedTerm !== undefined || term.mainHeadings !== undefined && term.mainHeadings.term !== undefined) {
            markup += "<i class='tooltip-popup term-related fa fa-info-circle fa-lg' title=''></i>";
        }
        markup += "</div>";
        markup += "</td>";
        markup += "</tr>";

        //LINK
        markup += "<tr>";
        markup += "<td>";
        if ((term.authority === 'local' && term.id !== "" && (term.sources !== undefined && term.sources.indexOf("getty") > -1)) || term.authority === 'aat') {
            markup += "&nbsp;<span class='link'>";
            markup += "<a target='_blank' onmouseup='openLink(this);' href='http://www.getty.edu/vow/AATFullDisplay?logic=AND&note=&english=N&prev_page=1&subjectid=" + term.id + "&find=" + term.id + "' title='Open in AAT'>AAT: " + term.id + "</a>";
            markup += "</span>";
        } else if ((term.authority === 'local' && term.id !== "" && (term.sources !== undefined && term.sources.indexOf("getty") > -1)) || term.authority === 'tgn') {
            markup += "&nbsp;<span class='link'>";
            markup += "<a target='_blank' onmouseup='openLink(this);' href='http://www.getty.edu/vow/TGNFullDisplay?place=&nation=&english=Y&prev_page=1&subjectid=" + term.id + "&find=" + term.id + "' title='Open in TGN'>TGN: " + term.id + "</a>";
            if (term.hierarchy !== undefined && term.hierarchy.value !== '') {
                markup += "<span class='hierarchy'>(" + term.hierarchy.value + ")</span>";
            }
            markup += "</span>";
        } else if ((term.authority === 'local' && term.id !== "" && (term.sources !== undefined && term.sources.indexOf("viaf") > -1)) || term.authority === 'viaf') {
            markup += "&nbsp;<span class='link'>";
            markup += "<a target='_blank' onmouseup='openLink(this);' href='http://www.viaf.org/" + term.id + "' title='Open in Viaf'>" + term.id + "</a>";
            markup += "</span>";
        }
        markup += "</td>";
        markup += "</tr>";
        markup += "</table>";

        //TOOLTIP
        markup += _tooltipMarkup(term, id, regex)
    }
    return markup;
}

function _tooltipMarkup(term, id, regex) {
    var relatedTerm, markup = '';
    if (term.authority === 'viaf') {
        if (term.mainHeadings !== undefined && term.mainHeadings.term !== undefined) {
            markup += "<div style='display:none' id='tooltip-" + id + "'>";
            markup += "<div>";
            markup += "<table>";
            if (Array.isArray(term.mainHeadings.term)) {
                for (i = 0; i < term.mainHeadings.term.length; i++) {
                    markup += "<tr>";
                    markup += "<td>" + term.mainHeadings.term[i].value + "</td>";

                    markup += "</tr>";
                    if (term.mainHeadings.term[i].sources !== undefined && term.mainHeadings.term[i].sources !== '') {
                        markup += "<tr>";
                        markup += "<td>";

                        sources = [];
                        sources = term.mainHeadings.term[i].sources.split(/\b\s+/);
                        for (j = 0; j < sources.length; j++) {
                            if (sources[j] !== '') {
                                markup += '<img src="/exist/apps/rosids-shared/resources/images/repositories/' + sources[j] + '.png" title="' + sources[j] + '" alt="' + sources[j] + '"/>';
                            }
                        }
                        markup += "</td>";
                        markup += "</tr>";
                    }
                }
            } else {
                markup += "<tr>";
                markup += "<td>" + term.mainHeadings.term.value + "</td>";
                markup += "</tr>";
                if (term.mainHeadings.term.sources !== undefined && term.mainHeadings.term.sources !== '') {
                    markup += "<tr>";
                    markup += "<td>";
                    sources = [];
                    sources = term.mainHeadings.term.sources.split(/\b\s+/);
                    for (j = 0; j < sources.length; j++) {
                        if (sources[j] !== '') {
                            markup += '<img src="/exist/apps/rosids-shared/resources/images/repositories/' + sources[j] + '.png" title="' + sources[j] + '" alt="' + sources[j] + '"/>';
                        }
                    }
                    markup += "</td>";
                    markup += "</tr>";
                }
            }
            markup += "</table>";
            markup += "</div>";
            markup += "</div>";
        }
    } else {
        markup += "<div style='display:none' id='tooltip-" + id + "'>";
        markup += "<div>";
        markup += "<table>";
        if (Array.isArray(term.descriptiveNote)) {
            for (i = 0; i < term.descriptiveNote.length; i++) {
                markup += "<tr class='note'>";
                markup += "<td>" + term.descriptiveNote[i].value;
                if (term.descriptiveNote[i].languages !== undefined) {
                    markup += ' (' + term.descriptiveNote[i].languages + ')'
                }
                markup += "</td>";
                markup += "</tr>";
            }
            markup += "<tr>";
            markup += "<td>&nbsp;</td>";
            markup += "</tr>";
        } else if (term.descriptiveNote !== undefined) {
            markup += "<tr class='note'>";
            markup += "<td>" + term.descriptiveNote.value;
            /*
             if(term.descriptiveNote. languages !== undefined) {
             markup += ' (' + term.descriptiveNote. languages + ')'
             }
             */
            markup += "</td>";
            markup += "</tr>";
            markup += "<tr>";
            markup += "<td>&nbsp;</td>";
            markup += "</tr>";
        }
        if (Array.isArray(term.relatedTerm)) {
            for (i = 0; i < term.relatedTerm.length; i++) {
                relatedTerm = term.relatedTerm[i].value.replace(regex, function (match) {
                    return '<b>' + match + '</b>';
                });
                markup += "<tr class='relatedTerm'>";
                markup += "<td>" + relatedTerm;
                if (term.relatedTerm[i].qualifiers !== undefined && term.relatedTerm[i].qualifiers !== '') {
                    markup += ' (' + term.relatedTerm[i].qualifiers + ')'
                }
                markup += "</td>";
                markup += "</tr>";

            }
        } else if (term.relatedTerm !== undefined) {
            relatedTerm = term.relatedTerm.value.replace(regex, function (match) {
                return '<b>' + match + '</b>';
            });
            markup += "<tr class='relatedTerm'>";
            markup += "<td>" + relatedTerm;
            if (term.relatedTerm.qualifiers !== undefined && term.relatedTerm.qualifiers !== '') {
                markup += ' (' + term.relatedTerm.qualifiers + ')'
            }
            markup += "</td>";
            markup += "</tr>";
        }
        markup += "</table>";
        markup += "</div>";
        markup += "</div>";
    }

    return markup;
}

function initSubjectsAutocomplete(autoComplete, parentNode, queryType) {
    autoComplete.select2({
        handler: undefined,
        name: queryType,
        placeholder: "Search for a name",
        minimumInputLength: 3,
        formatResult: _subjectsFormatResult,
        formatSelection: termFormatSelection,
        formatNoMatches: "<div>No matches</div>",
        dropdownCssClass: "bigdrop",
        allowClear: true,
        createSearchChoice: function (term) {
            return {"id": "-1", "type": "unknown", "value": "Add new entry.", "authority": "", "sources": "", "source": queryType};
        },
        id: function (object) {
            var myid, id;
            myid = object.id;
            if (myid !== undefined) {
                id = object.id;
            } else {
                id = object.uuid;
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
                    return {results: [data.term], more: more};
                }
            }
        }
    }).on('change', function (e) {
        var target, object, myid, refid, targetid;

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
            //alert("To be implemented ...");
        } else {
            object = null;
            if (e.added !== undefined) {
                object = e.added;
            }
            if (object !== null) {
                myid = object.id;
                if (myid !== undefined) {
                    refid = object.id;
                } else {
                    refid = object.uuid;
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
         var link = $('#' + e.val + ' .link');
         if (undefined == link.onmouseup) {
         link.on('mouseup', function (f) {
         f.stopPropagation();
         var url = $(f.target).attr('href');
         var win = window.open(url, '_blank');
         win.focus();
         });
         } else {
         console.log("mouseup present");
         }
         */
    });
}
;
