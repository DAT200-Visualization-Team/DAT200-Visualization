// Function for injecting templates from separate files, 
// taken from http://stackoverflow.com/questions/8366733/external-template-in-underscore koorchik's answer, 24.01.2017
function render(tmplName, tmplData) {
    if (!render.tmplCache) {
        render.tmplCache = {};
    }

    if (!render.tmplCache[tmplName]) {
        var tmplDir = "./static/templates";
        var tmplUrl = tmplDir + "/" + tmplName + ".html";

        var tmplString;
        $.ajax({
            url: tmplUrl,
            method: "GET",
            dataType: "html",
            async: false,
            success: function (data) {
                tmplString = data;
            }
        });

        render.tmplCache[tmplName] = Handlebars.compile(tmplString);
    }

    return render.tmplCache[tmplName](tmplData);
}

$.ajax({
    url: "./js/templateHelpers/categoryData.json",
    dataType: "json",
    async: false,
    success: function (data) {
        var renderedHeaderHtml = render("headerTemplate", data);
        $("body").prepend(renderedHeaderHtml);

        var currentFile = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
        if (currentFile == "index.html") {
            renderedIndexContent = render("frontPageContentTemplate", data);
            $("body").append(renderedIndexContent);

            $("#download-button").parent().remove();
            $("#download-button-mobile").parent().remove();
        }
    }
});