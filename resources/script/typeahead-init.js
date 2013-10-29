var autocompletes = [];

function initAutocompletes() {
    console.log("init-autocompletes()");
    
    $.each(autocompletes, function () {
        console.log('Destroying: ', this)
        this.typeahead('destroy');
    });
    autocompletes.length = 0;

    $(".xfRepeatItem [class$=-autocomplete-input]").each(function () {
        var jObject = $(this);
        var xfValue = jObject.parent('.xfContainer').find( '.' + jObject.attr('name') + ' .xfValue' )
        //$('#' + jObject.attr('callbackSet') + ' .xfRepeatItem .' + jObject.attr('name') + ' .xfValue');
        
        //console.log('#' + jObject.attr('callbackSet') + ' .xfRepeatItem .' + jObject.attr('name') + ' .xfValue')
        console.log("parent: " , jObject.parent('.xfContainer'));
        console.log("xfValue: " , xfValue, " Value: ", xfValue.val());
        
        //Set input ot xforms value
        jObject.val(xfValue.val());
        
        var name = jObject.attr("name");            
        var queryType = jObject.attr("queryType");
        var host = jObject.attr("host");
        
        
        console.log("Name: " , name , " queryType: " , queryType, ' HOST:', host);
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
                        + '<div class="th_resources">'
                        +   '<span class="img_{{resource}}"></span>'
                        + '</div>'
                        + '<div class="th_text_wrapper">'
                        +   '<div class="th_value" title="{{type}}">{{value}}</div>'
                        +   '{{#bio}}<div class="th_bio">{{/bio}}{{bio}}{{#bio}}</div>{{/bio}}'
                        +   '{{#hint}}<div class="th_hint" title="{{hint}}"/>{{/hint}}'
                        + '</div>'
                        + '<div class="th_sources">'
                        +   '{{#sources}}<span class="img_{{.}}"></span>{{/sources}}'
                        + '</div>'
                    + '</div>',
            engine: Hogan,
            remote: {
                url: host + '/exist/apps/cluster-services/modules/services/search/search.xql?' + queryType + '=%QUERY',
                filter: function(parsedData){
                    var dataset = [];
                    if( Object.prototype.toString.call( parsedData.result ) === '[object Array]' ) {
                        var dataset = [];
                        for(i = 0; i < parsedData.result.length; i++) {
                            var bio = null;
                            if(parsedData.result[i].bio !== undefined && parsedData.result[i].bio !== '') { bio = parsedData.result[i].bio };
                            
                            var sourcesArray = null;
                            
                            if( parsedData.result[i].sources !== null) { 
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
                        if(parsedData.result.bio !== undefined && parsedData.result.bio !== '') { bio = parsedData.result.bio };
                            
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
                            sources: parsedData.result.sources.split(/\b\s+/),
                            hint: parsedData.result.hint
                        });
                    }
                    return dataset;
                }
            }
        }).on('typeahead:selected', function (e, datum) {
            console.log("typeahead:selected : ", datum)
            var target = jQuery(e.target);
            var xfValue = $('#' + jObject.attr('callbackSet') + ' .xfRepeatIndex .' + jObject.attr('name') + ' .xfValue');
            xfValue.val(datum.name)
            
            var id = xfValue.attr('id');
            id = id.substring(0, id.indexOf('-value'));
            console.log("ID: " , id)
            fluxProcessor.sendValue("" + id, datum.name);
            
            if(target.attr('queryType') === 'names') {
                console.log("Names query.")
                if(datum.bio != null) {
                   console.log("Name BIO:", datum.bio);
                   console.log("Name earliestDate:", datum.earliestDate);
                   console.log("Name latestDate:", datum.latestDate);
                   
                   if(datum.earliestDate != null) {
                       var earliestDateW = $('#' + jObject.attr('callbackSet') + ' .xfRepeatIndex input[placeholder=EarliestDate]');
                       console.log("Name earliestDate:", earliestDateW);
                       earliestDateW.val(datum.earliestDate);
                       var id = earliestDateW.attr('id')
                       id = id.substring(0, id.indexOf('-value'));
                       console.log("ID: " , id);
                       fluxProcessor.sendValue("" + id, datum.earliestDate);
                   }
                   
                   if(datum.latestDate != null) {
                       var latestDateW = $('#' + jObject.attr('callbackSet') + ' .xfRepeatIndex input[placeholder=LatestDate]');
                       console.log("Name earliestDate:", latestDateW);
                       latestDateW.val(datum.latestDate);
                       var id = latestDateW.attr('id')
                       id = id.substring(0, id.indexOf('-value'));
                       console.log("ID: " , id);
                       fluxProcessor.sendValue("" + id, datum.latestDate);
                   }
                }
            } else if(target.attr(queryType) === 'subjects') {
                console.log("Subjects query.")
            } else {
                console.log("Unknown query.")
            }
        });
        
        autocompletes.push(jObject);
    });
}