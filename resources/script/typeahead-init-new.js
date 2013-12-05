var autocompletes = [];
var DEBUG = true;

function resetAutocompletes() {
    if(DEBUG) {
        console.log("resetAutocompletes()");
    }

    $.each(autocompletes, function() {
        if(DEBUG) {
            console.log('Destroying: ', this);
        }
        this.typeahead('destroy');
     });
     autocompletes.length = 0; 
}

function initAutocompletes() {
    if(DEBUG) {
        console.log("initAutocompletes()"); 
    }
    
    resetAutocompletes();

    $(".xfRepeatItem [class$=-autocomplete-input]").each(function() {
        var jQueryObject = $(this);
        var queryType = jQueryObject.attr("queryType");
        var host = jQueryObject.attr("host");
        
        //Try to find parent which should be a wrapping xfContainer or xfRepeatItem
        var parent = jQueryObject.parent('.xfContainer');
        if(parent.length === 0) {
            parent = jQueryObject.parent('.xfRepeatItem');
        }
        
        //Get current value of xforms controll
        var xfValue = parent.find('.' + jQueryObject.attr('name') + ' .xfValue');
        
        if(DEBUG) {
            console.log("TARGET: ", this);
            console.log("QUERYTYPE: ", queryType);
            console.log("HOST: ", host);
            console.log("PARENT: ", parent);
            console.log("PARENT VALUE: ", xfValue.val());
        }

        //Set input ot xforms value
        jQueryObject.val(xfValue.val());

        //Init typeahead controll
        jQueryObject.typeahead({
            name: queryType,
            dataType: "json",
            minLength: 3,
            limit: 20,
            template: '<div class="th_wrapper">'
                    + '<div class="th_text_wrapper">'
                    + '<div class="th_value" title="{{dtype}}">{{dvalue}}</div>'
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
                        for (i = 0; i < parsedData.result.length; i++) {
                            var dname = "";
                            if (parsedData.result[i].name !== null) {
                                dname = parsedData.result[i].name;
                            }
                            
                            var dvalue = "";
                            if (parsedData.result[i].value !== null) {
                                dvalue = parsedData.result[i].value;
                            }
                            
                            var internalID = "";
                            if (parsedData.result[i].internalID !== null) {
                                internalID = parsedData.result[i].internalID;
                            }
                            
                            var bio = "";
                            if (parsedData.result[i].bio !== null) {
                                bio = parsedData.result[i].bio;
                            }
                            
                            var earliestDate = "";
                            if (parsedData.result[i].earliestDate !== null) {
                                earliestDate = parsedData.result[i].earliestDate;
                            }
                            
                            var latestDate = "";
                            if (parsedData.result[i].latestDate !== null) {
                                latestDate = parsedData.result[i].latestDate;
                            }
                            
                            var uuid = "";
                            if (parsedData.result[i].uuid !== null) {
                                uuid = parsedData.result[i].uuid;
                            }
                            
                            var resource = "";
                            if (parsedData.result[i].resource !== null) {
                                resource = parsedData.result[i].resource;
                            }
                            
                            var dtype = "";
                            if (parsedData.result[i].type !== null) {
                                dtype = parsedData.result[i].type;
                            }
                            
                            var sourcesArray = [];

                            if (parsedData.result[i].sources !== null) {
                                sourcesArray = parsedData.result[i].sources.split(/\b\s+/);
                            }
                            
                            var hint = "";
                            if (parsedData.result[i].hint !== null) {
                                hint = parsedData.result[i].hint;
                            }

                            dataset.push({
                                dname: dname,
                                dvalue: dvalue,
                                internalID: internalID,
                                bio: bio,
                                earliestDate: earliestDate,
                                latestDate: latestDate,
                                uuid: uuid,
                                resource: resource,
                                dtype: dtype,
                                sources: sourcesArray,
                                hint: hint
                            });
                        }
                    } else {
                        
                        var dname = "";
                        if (parsedData.result.name !== null) {
                            dname = parsedData.result.name;
                        }

                        var dvalue = "";
                        if (parsedData.result.value !== null) {
                            dvalue = parsedData.result.value;
                        }

                        var internalID = "";
                        if (parsedData.result.internalID !== null) {
                            internalID = parsedData.result.internalID;
                        }

                        var bio = "";
                        if (parsedData.result.bio !== null) {
                            bio = parsedData.result.bio;
                        }

                        var earliestDate = "";
                        if (parsedData.result.earliestDate !== null) {
                            earliestDate = parsedData.result.earliestDate;
                        }

                        var latestDate = "";
                        if (parsedData.result.latestDate !== null) {
                            latestDate = parsedData.result.latestDate;
                        }

                        var uuid = "";
                        if (parsedData.result.uuid !== null) {
                            uuid = parsedData.result.uuid;
                        }

                        var resource = "";
                        if (parsedData.result.resource !== null) {
                            resource = parsedData.result.resource;
                        }

                        var dtype = "";
                        if (parsedData.result.type !== null) {
                            dtype = parsedData.result.type;
                        }

                        var sourcesArray = [];

                        if (parsedData.result.sources !== null) {
                            sourcesArray = parsedData.result.sources.split(/\b\s+/);
                        }

                        var hint = "";
                        if (parsedData.result.hint !== null) {
                            hint = parsedData.result.hint;
                        }

                        dataset.push({
                                dname: dname,
                                dvalue: dvalue,
                                internalID: internalID,
                                bio: bio,
                                earliestDate: earliestDate,
                                latestDate: latestDate,
                                uuid: uuid,
                                resource: resource,
                                dtype: dtype,
                                sources: sourcesArray,
                                hint: hint
                        });
                    }
                    
                    if(DEBUG) {
                        console.log("DATESET: ", dataset);
                    }
                    
                    return dataset;
                }
            }
        }).on('typeahead:selected', function(e, datum) {
            var target = jQuery(e.target);
            //Find corresponing xfcontroll to typeahead controll
            var xfTarget = $('#' + target.attr('callbackSet') + ' .xfRepeatIndex .' + target.attr('name'));
            
            if(DEBUG) {
                console.log("TARGET : ", target);
                console.log("XFTARGET : ", xfTarget);
                console.log("DATUM : ", datum);
            }
            
            //Send event to xformsprocessor with contextinfo
            fluxProcessor.dispatchEventType( xfTarget.attr('id'), 'autocomplete-callback', { dname:datum.dname, dvalue:datum.dvalue, internalID:datum.internalID, bio:datum.bio, earliestDate:datum.earliestDate, latestDate:datum.latestDate, uuid:datum.uuid, resource:datum.resource, dtype:datum.dtype});
        });

        autocompletes.push(jQueryObject);
    });
}