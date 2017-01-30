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
