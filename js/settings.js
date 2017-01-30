$(document).ready(function(){
    $('#settings-modal').modal();
    $(".button-collapse").sideNav();
    loadFontSizeCookieValue();
    $('select').material_select();
});

$(document).on('change', '#font-size-select', function () {

    var selectedSize = $(this).find('option:selected').attr('value');

    if($('#code-text'))
        $('#code-text').css({ 'font-size': selectedSize + "px" });

    setCookie('font-size', selectedSize, 1000);
});

function loadFontSizeCookieValue() {
    var savedValue = getCookie('font-size');
    if (savedValue) {
        $('#font-size-select').val(savedValue);
        if ($('#code-text'))
            $('#code-text').css({ 'font-size': savedValue + "px" });
    }
}

function downloadObjectJson(objectToDownload) {
    var dataString = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(objectToDownload));
    var dlAnchorElem = document.getElementById('downloadLink');
    dlAnchorElem.setAttribute("href", dataString);
    dlAnchorElem.setAttribute("download", (objectToDownload.constructor.name + ".json"));
    dlAnchorElem.click();
}