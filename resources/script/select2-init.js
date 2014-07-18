/*
    TODO:
        - get collections from select
        - sent collections to service
*/
var autocompletes = {};
var config = {
    "host": "http://kjc-sv013.kjc.uni-heidelberg.de:38080"
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
    
function termFormatResult(term, container, query) {
    var markup;
    
    if(term.value === 'dummy') {
        markup = "";
    } else {
        var type = 'question';
        if(term.type === 'personal') {
            type = 'user'
        } else if ( term.type === 'corporate' ) { 
            type = 'globe'
        } else if ( term.type === 'subject' ) { 
            type = 'bookmark'
        }
        
    

        var regex = new RegExp(query.term, 'gi');
        var value = term.value.replace(regex, function(match) {return '<b class=""select2-match>'+match+'</b>'});

        markup = "<table class='term-result'>";
        markup += "<tr>";
        markup += "<td class='term-info'>";
            markup += "<div class='term-term'>"
                markup += "<span class='term-type'><i class='fa fa-" + type + "'></i></span>"
                markup += "<span class='term-value'"
                markup += ">" + value;
                    if(term.bio != null) {
                        markup += "<span class='term-bio'> (" + term.bio + ") </span>";
                    }
                    if (term.relatedTerms !== undefined) {
                        //TODO: highlight matches in tooltip!
                        var relatedTerms = term.relatedTerms.replace(regex, function(match) {return '&lt;b class="select2-match"&gt;'+match+'&lt;/b&gt;'});
                        //markup += "<i class='term-related fa fa-info-circle fa-lg' title='"+ relatedTerms + "'></i>";
                        markup += "<i class='term-related fa fa-info-circle fa-lg' title='&lt;span&gt;" + relatedTerms + "&lt;/span&gt;'></i>";
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
    }
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
        var name = jObject.attr('name');
        var key = parent.find('.' + name).attr('id');
        console.log("KEY: ", key);
        
        if (parent.length !== 0) {
            if ( autocompletes[key] === undefined ) {
                var xfValue = parent.find('.' + jObject.attr('name') + ' .xfValue');
                //console.log("xfValue: ", xfValue, " Value: ", xfValue.val());
               

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
                    formatNoMatches: "<div>No matches</div>",
                    dropdownCssClass: "bigdrop",
                    allowClear: true,
                    createSearchChoice: function(term) { return { "id" : "-1", "type" : "unknown", "value" : "Add new entry.", "authority" : "", "sources" : "", "src" : "" } },
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
                    ajax: {
                        url: host + "/exist/apps/rosids-services/modules/services/search/suggest.xq",
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
                            if( Array.isArray(data.term) ) {
                                return {results: data.term, more: more};
                            } else {
                                return { results: [data.term], more: more};
                            }
                        }
                    }
                }).on('change', function(e) {
                    console.log(e.object);
                    var target = jQuery(e.target);
                    if("" === e.val) {
                       fluxProcessor.dispatchEventType( target.attr('key'), 'autocomplete-callback', {
                            termValue:"",
                            refid:"",
                            earliestDate:"",
                            latestDate:"",
                            authority:"",
                            termType:""
                        }); 
                    } else if ("-1" === e.val){
                        alert("To be implemented ...");
                    } else {
                        var object = null;
                        if(e.added !== undefined) {
                            object = e.added;
                        }
                        if(object !== null) {
                            var uuid = object.uuid;
                            var refid;
                            if(uuid !== undefined) {
                                refid = object.uuid;
                            } else {
                                refid = object.id;
                            }

                            fluxProcessor.dispatchEventType( target.attr('key'), 'autocomplete-callback', {
                                termValue:object.value,
                                refid:refid,
                                earliestDate:object.earliestDate,
                                latestDate:object.latestDate,
                                authority:object.authority,
                                src:object.src,
                                termType:object.type
                            });
                        }
                    }
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
    
    
};