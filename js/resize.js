$(document).ready(function () {
    $("#graphics").resizable();
});

$("#graphics").resize(function () {
    $("#code").width($("#view").width() - $("#graphics").width() - 3);
});

$(window).resize(function(){
    $("#code").width($("#view").width() - $("#graphics").width() - 3);
    $("#graphics").height($("#view").height());
});
