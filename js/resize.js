var windowToggleState = 0;

$(document).ready(function () {
    $("#graphics").resizable({handles: "e"});

    if ($(window).width() < 700) {
        windowToggleState = 1;
        $("#graphics").show();
        $("#graphics").width($("#view").width());
        $("#code").width(0);
    }

    $("#toggle-view-button").click(function () {
        if (++windowToggleState > 2) windowToggleState = 0;
        if (windowToggleState === 0 && $(window).width() < 750) {
            windowToggleState = 1;
            $("#graphics").show();
        }

        switch (windowToggleState) {
            case 0:
                $("#graphics").show();
                $("#graphics").width($("#view").width() / 2);
                $("#code").width($("#view").width() / 2 - 3);
                break;
            case 1:
                $("#graphics").width($("#view").width());
                $("#code").width(0);
                break;
            case 2:
                $("#code").width($("#view").width() - 3);
                $("#graphics").width(0);
                $("#graphics").hide();
                break;
        }
    });
});

$("#graphics").resize(function () {
    $("#code").width($("#view").width() - $("#graphics").width() - 3);
});

$(window).resize(function(){
    $("#code").width($("#view").width() - $("#graphics").width() - 3);
    $("#graphics").height($("#view").height());
});
