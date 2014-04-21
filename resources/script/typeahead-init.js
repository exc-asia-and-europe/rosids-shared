var autocompletes = {};

function clearAndInitAutocompletes() {
    console.log("clearAndInitAutocompletes()");

    for (var key in autocompletes) {
        if (autocompletes.hasOwnProperty(key)) {
            var thObject = autocompletes[key];
            console.log('Destroying: ', thObject);
            thObject.typeahead('destroy');
        }
    }

    autocompletes = {};
    initAutocompletes();
};

function initAutocompletes() {
    console.log("initAutocompletes()");
    console.log("initAutocompletes(): " , autocompletes);

    $(".xfRepeatItem [class$=-autocomplete-input]").each(function() {
        var jObject = $(this);
        console.log("this: ", this);
        var parent = jObject.parent('.xfContainer');
        if(parent.length === 0) {
            parent = jObject.parent('.xfRepeatItem');
        }
        //console.log("parent: ", parent);
        
        if (parent.length !== 0) {
            if(autocompletes[key] === undefined) { 
                var xfValue = parent.find('.' + jObject.attr('name') + ' .xfValue');
                //console.log("xfValue: ", xfValue, " Value: ", xfValue.val());
                var key = parent.find('.' + jObject.attr('name')).attr('id');
                console.log("KEY: ", key);
                
                //Set input ot xforms value
                jObject.val(xfValue.val());
                var name = jObject.attr('name');
                var queryType = jObject.attr('queryType');
                var host = jObject.attr('host');
        
        
                //console.log("Name: ", name, " queryType: ", queryType, ' HOST:', host);
                /*
                 <result>
                 <name>Not found</name>
                 <value>Not found</value>
                 <internalID/>
                 <bio/>
                 <uuid/>
                 <resource/>
                 <type/>
                 <sources/>
                 <hint>create/request new record</hint>
                 </result>
                 */
                jObject.typeahead({
                    name: queryType,
                    dataType: "json",
                    minLength: 3,
                    limit: 3,
                    template: '<div class="th_wrapper">'
                            + '<div class="th_text_wrapper">'
                            + '<div class="th_value" title="{{type}}">{{value}}</div>'
                            + '{{#bio}}<div class="th_bio">{{/bio}}{{bio}}{{#bio}}</div>{{/bio}}'
                            + '{{#hint}}<div class="th_hint" title="{{hint}}"/>{{/hint}}'
                            + '</div>'
                            + '<div class="th_sources">'
                            + '{{#sources}}<span class="img_{{.}}"></span>{{/sources}}'
                            + '</div>'
                            + '<div class="th_resources">'
                            + '<span class="img_{{resource}}"></span>'
                            + '</div>'
                            + '</div>',
                    engine: Hogan,
                    remote: {
                        url: host + '/exist/apps/cluster-services/modules/services/search/search.xql?' + queryType + '=%QUERY',
                        filter: function(parsedData) {
                            var dataset = [];
                            if (Object.prototype.toString.call(parsedData.result) === '[object Array]') {
                                var dataset = [];
                                for (i = 0; i < parsedData.result.length; i++) {
                                    var bio = null;
                                    if (parsedData.result[i].bio !== null) {
                                        bio = parsedData.result[i].bio;
                                    }
        
                                    var sourcesArray = null;
        
                                    if (parsedData.result[i].sources !== null) {
                                        sourcesArray = parsedData.result[i].sources.split(/\b\s+/);
                                    }
        
        
        
        
                                    //console.log("Sources: ", sourcesArray);
        
                                    dataset.push({
                                        name: parsedData.result[i].name,
                                        value: parsedData.result[i].value,
                                        internalID: parsedData.result[i].internalID,
                                        bio: bio,
                                        earliestDate: parsedData.result[i].earliestDate,
                                        latestDate: parsedData.result[i].latestDate,
                                        uuid: parsedData.result[i].uuid,
                                        resource: parsedData.result[i].resource,
                                        type: parsedData.result[i].type,
                                        sources: sourcesArray,
                                        hint: parsedData.result[i].hint
                                    });
                                }
                            } else {
                                var bio = null;
                                if (parsedData.result.bio !== null) {
                                    bio = parsedData.result.bio;
                                }
                                var sources = [];
                                if(parsedData.result.sources !== null) {
                                    sources = parsedData.result.sources.split(/\b\s+/);
                                }
                                
        
                                dataset.push({
                                    name: parsedData.result.name,
                                    value: parsedData.result.value,
                                    internalID: parsedData.result.internalID,
                                    bio: bio,
                                    earliestDate: parsedData.result.earliestDate,
                                    latestDate: parsedData.result.latestDate,
                                    uuid: parsedData.result.uuid,
                                    resource: parsedData.result.resource,
                                    type: parsedData.result.type,
                                    sources: sources,
                                    hint: parsedData.result.hint
                                });
                            }
                            return dataset;
                        }
                    }
                }).on('typeahead:selected', function(e, datum) {
                    //console.log("typeahead:selected : ", datum);
                    var target = jQuery(e.target);
                    fluxProcessor.dispatchEventType( target.attr('key'), 'autocomplete-callback', { name:datum.name, value:datum.value, internalID:datum.internalID, bio:datum.bio, earliestDate:datum.earliestDate, latestDate:datum.latestDate, uuid:datum.uuid, resource:datum.resource, datumType:datum.type});
                });
                
                jObject.attr('key', key);
                autocompletes[key] = jObject;
                //console.log("initAutocompletes(): " , autocompletes);
                //console.log("initAutocompletes(): " , autocompletes[key]);
            } else {
                //console.log("initAutocompletes(): ignore already initalized autocomplete element");
            }
        } else {
            //console.log("initAutocompletes(): ignore parentless element");
        }
    });
};