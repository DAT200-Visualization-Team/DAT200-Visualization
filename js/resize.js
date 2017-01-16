/**
 * Created by Simen on 10.01.2017.
 */
var graphicsWindow = $("#graphics");
var codeWindow = $("#code");
var view = $("#view");

graphicsWindow.resizable();
graphicsWindow.resize(function(){
    codeWindow.width(view.width()-graphicsWindow.width()-3);
});
$(window).resize(function(){
    codeWindow.width(view.width()-graphicsWindow.width()-3);
    graphicsWindow.height(view.height());
});
