var autocompletes = {};
var config = {
    "host": "http://localhost:8080"
}

function clearAndInitAutocompletes() {
    console.log("clearAndInitAutocompletes()");

    for (var key in autocompletes) {
        if (autocompletes.hasOwnProperty(key)) {
            var select2Object = autocompletes[key];
            console.log('Destroying: ', select2Object);
            select2Object.select2('destroy');
        }
    }

    autocompletes = {};
    initAutocompletes();
};
    
function termFormatResult(term) {
        var type = 'question';
        if(term.type === 'personal') {
            type = 'user'
        } else if ( term.type === 'corporate' ) { 
            type = 'globe'
        } else if ( term.type === 'subject' ) { 
            type = 'bookmark'
        }
        
        var markup = "<table class='term-result'>";
        markup += "<tr>";
        markup += "<td class='term-info'>";
            markup += "<div class='term-term'>"
                markup += "<span class='term-type'><i class='fa fa-" + type + "'></i></span>"
                markup += "<span class='term-value'"
                markup += ">" + term.value;
                    if(term.bio != null) {
                        markup += "<span class='term-bio'> (" + term.bio + ") </span>";
                    }
                    if (term.relatedTerms !== undefined) {
                        markup += "<i class='term-related fa fa-info-circle fa-lg' title='"+ term.relatedTerms + "'></i>";
                    }
                markup +="</span>";
            markup +="</div>";

            markup += "<div class='term-origin'>";
                markup += "<span class='term-authority img_" + term.authority + "'></span>";
                if (term.sources !== undefined) {
                    var sources = [];
                    sources = term.sources.split(/\b\s+/);
                    markup += "<span class='term-sources'>";
                    
                    for( i=0; i < sources.length; i++){
                        if(sources[i] !== term.authority) {
                            markup += '<span class="img_' + sources[i] + '"></span>';
                        }
                    }
                    
                    markup += "</span>";
                }
            markup += "</div>";
            
        markup += "</td>";
        markup += "</tr>";
        markup += "</table>";
        return markup;
};

function termFormatSelection(term) {
    return term.value;
};
function initAutocompletes() {
    console.log("initAutocompletes()");
    console.log("initAutocompletes(): ", autocompletes);

    $(".xfRepeatItem [class$=-autocomplete-input]").each(function() {
        var jObject = $(this);
        console.log("this: ", this);
        var parent = jObject.parent('.xfContainer');
        if (parent.length === 0) {
            parent = jObject.parent('.xfRepeatItem');
        }
        //console.log("parent: ", parent);

        if (parent.length !== 0) {
            if ( autocompletes[key] === undefined ) {
                var xfValue = parent.find('.' + jObject.attr('name') + ' .xfValue');
                //console.log("xfValue: ", xfValue, " Value: ", xfValue.val());
                var key = parent.find('.' + jObject.attr('name')).attr('id');
                console.log("KEY: ", key);

                //Set input ot xforms value
                jObject.val(xfValue.val());
                var name = jObject.attr('name');
                var queryType = jObject.attr('data-queryType');
                var host = config.host;
                if ( !(jObject.hasClass('select2-container')) ) {
                jObject.select2({
                    name: queryType,
                    placeholder: "Search for a term",
                    minimumInputLength: 3,
                    formatResult: termFormatResult,
                    formatSelection: termFormatSelection,
                    dropdownCssClass: "bigdrop",
                    id: function(object) {
                        var uuid = object.uuid;
                        var id;
                        if(uuid !== undefined) {
                            id = object.uuid;
                        } else {
                            id = object.id;
                        }
                        return id;
                    },
                    escapeMarkup: function(m) {
                        return m;
                    },
                    initSelection: function(element, callback) {
                        //console.log("iniSelection: " + $(element).val());
                        //TODO: create service and check entries!!!!
                        var term = $(element).val();
                        callback({value: term});
                    },
                    /*
                    matcher: function(term, text) {
                        return text.toUpperCase().indexOf(term.toUpperCase())>=0;
                    },
                    */
                    ajax: {
                        url: host + "/exist/apps/cluster-services/modules/services/search/suggest.xq",
                        dataType: "json",
                        crossDomain: true,
                        data: function(term, page) {
                            return {
                                type: queryType,
                                query: term,
                                page_limit: 10,
                                page: page
                            };
                        },
                        results: function(data, page) {
                            if(parseInt(data.total, 10) === 0) {
                                return {results: [], more: more};
                            }
                            
                            var more = (page * 10) < data.total;
                            return {results: data.term, more: more};
                        }
                    }
                }).on('select2-selecting', function(e) {
                    console.log(e.object);
                    var target = jQuery(e.target);
                    
                    var uuid = e.object.uuid;
                    var refid;
                    if(uuid !== undefined) {
                        refid = e.object.uuid;
                    } else {
                        refid = e.object.id;
                    }
                    
                    fluxProcessor.dispatchEventType( target.attr('key'), 'autocomplete-callback', {
                        termValue:e.object.value,
                        refid:refid,
                        earliestDate:e.object.earliestDate,
                        latestDate:e.object.latestDate,
                        authority:e.object.authority,
                        termType:e.object.type
                    });
                });
                }
               
               
                jObject.attr('key', key);
                autocompletes[key] = jObject;
                console.log("initAutocompletes(): " , autocompletes);
                console.log("initAutocompletes(): " , autocompletes[key]);
            } else {
                console.log("initAutocompletes(): ignore already initalized autocomplete element");
            }
        } else {
            console.log("initAutocompletes(): ignore parentless element");
        }
    });
}
;