var autocompletes = [];

function handlePerson(jqueryObject, datum) {

    //Handle type
    //Set value if present else to empty string
    var type = "";
    if (datum.type !== null) {
        type = datum.type;
    }

    var typeSelect = $('#' + jqueryObject.attr('callbackSet') + ' .xfRepeatIndex .nameType select');
    //Chek if we found the control
    if (typeSelect.length) {
        typeSelect.val(type);
        var id = typeSelect.attr('id');
        id = id.substring(0, id.indexOf('-value'));
        fluxProcessor.sendValue("" + id, type);
    }

    //Handle earliestDate
    //Set value if present else to empty string
    var earliestDate = "";
    if (datum.earliestDate !== null) {
        earliestDate = datum.earliestDate;
        console.log("Name earliestDate:", earliestDate);
    }

    var earliestDateW = $('#' + jqueryObject.attr('callbackSet') + ' .xfRepeatIndex input[placeholder=EarliestDate]');
    //Chek if we found the control
    if (earliestDateW.length) {
        console.log("Name earliestDate:", earliestDateW);
        earliestDateW.val(earliestDate);
        var id = earliestDateW.attr('id');
        id = id.substring(0, id.indexOf('-value'));
        console.log("ID: ", id);
        fluxProcessor.sendValue("" + id, earliestDate);
    }

    //Handle latestDate
    //Set value if present else to empty string
    var latestDate = "";
    if (datum.latestDate !== null) {
        latestDate = datum.latestDate;
        console.log("Name latestDate:", latestDate);
    }

    var latestDateW = $('#' + jqueryObject.attr('callbackSet') + ' .xfRepeatIndex input[placeholder=LatestDate]');
    //Chek if we found the control
    if (latestDateW.length) {
        console.log("Name LatestDate:", latestDateW);
        latestDateW.val(latestDate);
        var id = latestDateW.attr('id');
        id = id.substring(0, id.indexOf('-value'));
        console.log("ID: ", id);
        fluxProcessor.sendValue("" + id, latestDate);
    }
}

function initAutocompletes() {
    console.log("init-autocompletes()");

    $.each(autocompletes, function() {
        console.log('Destroying: ', this);
        this.typeahead('destroy');
    });
    autocompletes.length = 0;

    $(".xfRepeatItem [class$=-autocomplete-input]").each(function() {
        var jObject = $(this);
        var xfValue = jObject.parent('.xfContainer').find('.' + jObject.attr('name') + ' .xfValue');
        //$('#' + jObject.attr('callbackSet') + ' .xfRepeatItem .' + jObject.attr('name') + ' .xfValue');

        //console.log('#' + jObject.attr('callbackSet') + ' .xfRepeatItem .' + jObject.attr('name') + ' .xfValue')
        console.log("parent: ", jObject.parent('.xfContainer'));
        console.log("xfValue: ", xfValue, " Value: ", xfValue.val());

        //Set input ot xforms value
        jObject.val(xfValue.val());

        var name = jObject.attr("name");
        var queryType = jObject.attr("queryType");
        var host = jObject.attr("host");


        console.log("Name: ", name, " queryType: ", queryType, ' HOST:', host);
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
            limit: 20,
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
                        if (parsedData.bio !== null) {
                            bio = parsedData.bio;
                        }

                        dataset.push({
                            name: parsedData.name,
                            value: parsedData.value,
                            internalID: parsedData.internalID,
                            bio: bio,
                            earliestDate: parsedData.earliestDate,
                            latestDate: parsedData.latestDate,
                            uuid: parsedData.uuid,
                            resource: parsedData.resource,
                            type: parsedData.type,
                            sources: parsedData.sources.split(/\b\s+/),
                            hint: parsedData.hint
                        });
                    }
                    return dataset;
                }
            }
        }).on('typeahead:selected', function(e, datum) {
            console.log("typeahead:selected : ", datum);
            var target = jQuery(e.target);
            var xfValue = $('#' + jObject.attr('callbackSet') + ' .xfRepeatIndex .' + jObject.attr('name') + ' .xfValue');
            xfValue.val(datum.name);

            var id = xfValue.attr('id');
            id = id.substring(0, id.indexOf('-value'));
            console.log("ID: ", id);
            fluxProcessor.sendValue("" + id, datum.name);

            if (target.attr('queryType') === 'names') {
                console.log("Names query.");
                if (datum.type === 'personal') {
                    handlePerson(jObject, datum);
                } else if (datum.type === 'corporate') {
                    handlePerson(jObject, datum);
                }
            } else if (target.attr(queryType) === 'subjects') {
                console.log("Subjects query.");
            } else {
                console.log("Unknown query.");
            }
        });

        autocompletes.push(jObject);
    });
}