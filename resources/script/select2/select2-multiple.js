/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $, window, document */
var _model = {};

function initModel(data) {
    "use strict";
    _model['user'] = data.querySelector('user').innerHTML;
    _model['groups'] = data.querySelector('groups').innerHTML;
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

function _repositoriesFormatResult(repo) {
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
};

/*
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
};
*/

function initMultipleRepositories(parentNode, parentId) {
    "use strict";
    var globalSelect;
    
    globalSelect = parentNode.find('input[name = "global-select"]');

    $.ajax({
        url: config.host + '/exist/apps/rosids-shared/modules/ziziphus/repositories/repositories.xq',
        dataType: 'json',
        data: _model,
        crossDomain: true,
        success: function (data) {
            var globalOptions = data.repository;

            if (Array.isArray(data.repository) && data.repository.length > 1) {
                globalSelect.select2({
                    minimumResultsForSearch: -1,
                    formatResult: _repositoriesFormatResult,
                    formatSelection: _repositoriesFormatResult,
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
                            data: _model,
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
                                    formatResult: _repositoriesFormatResult,
                                    formatSelection: _repositoriesFormatResult,
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
};