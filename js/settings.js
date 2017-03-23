$(document).ready(function(){
    $('#settings-modal').modal();
    $(".button-collapse").sideNav();
    loadFontSizeCookieValue();
    $('select').material_select();
    $('#file-input').on('change', readUploadedFile);

    var uploadedObject = getCookie('uploadedVariable');
    console.log(uploadedObject);
    if (uploadedObject != '') {
        deleteCookie('uploadedVariable');
        processUploadedObject(JSON.parse(uploadedObject));
    }
});

$(document).on('change', '#font-size-select', function () {

    var selectedSize = $(this).find('option:selected').attr('value');

    if($('#code-text'))
        $('#code-text').css({ 'font-size': selectedSize + 'px' });

    setCookie('font-size', selectedSize, 1000);
});

function loadFontSizeCookieValue() {
    var savedValue = getCookie('font-size');
    if (savedValue) {
        $('#font-size-select').val(savedValue);
        if ($('#code-text'))
            $('#code-text').css({ 'font-size': savedValue + 'px' });
    }
}

function downloadObjectJson(objectToDownload, fileName) {
    if(fileName == null) {
        fileName = objectToDownload.constructor.name;
    }
    var dataString = 'data:text/json;charset=utf-8,' + encodeURIComponent('{"' + fileName + '": ' + JSON.stringify(objectToDownload) + '}');
    var dlAnchorElem = document.getElementById('downloadLink');
    dlAnchorElem.setAttribute('href', dataString);
    dlAnchorElem.setAttribute('download', (fileName + '.json'));
    dlAnchorElem.click();
}

function readUploadedFile() {
    var file = document.getElementById('file-input').files[0];
    var fileReader = new FileReader();
    fileReader.onload = function (e) {
        var text = fileReader.result;
        redirectToCorrectPageForUpload(JSON.parse(text));
    };

    fileReader.readAsText(file, 'utf-8');
}

function redirectToCorrectPageForUpload(object) {
    $.ajax({
        url: './js/templateHelpers/categoryData.json',
        dataType: 'json',
        success: function (data) {
            var categories = data.categories;
            var types = [];

            for (var i = 0; i < categories.length; i++) {
                for (var j = 0; j < categories[i].subCategories.length; j++) {
                    types.push(categories[i].subCategories[j].id);
                }
            }

            for(var i = 0; i < types.length; i++) {
                if (Object.keys(object)[0].toLowerCase() == types[i]) {
                    document.location.href = './' + types[i] + '.html';

                    setCookie('uploadedVariable', JSON.stringify(object), 1);
                }
            }
        }
    });
}