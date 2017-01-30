$(document).ready(function(){
    $('#settings-modal').modal();
    $('select').material_select();
    $(".button-collapse").sideNav();
});

$(document).on('change', '#font-size-select', function () {
    if($('#code-text'))
        $('#code-text').css({ 'font-size': $(this).find('option:selected').attr('value') + "px" });

    //TODO: Save font size in cookies
});
