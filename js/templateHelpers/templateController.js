$(document).ready(function () {
	$('.modal').modal();
});

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
		var currentFile = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
		data.info = getInfo(data, currentFile.split('.')[0]);
		console.log(data.info);
        var renderedHeaderHtml = render("headerTemplate", data);
        $("body").prepend(renderedHeaderHtml);

        
        if (currentFile == "index.html") {
            renderedIndexContent = render("frontPageContentTemplate", data);
            $("body").append(renderedIndexContent);

            $("#download-button").parent().remove();
            $("#download-button-mobile").parent().remove();
        }
        else {
            var filteredData = filterDataToSubCategory(data, currentFile.split('.')[0]);
            var commandHtml = render("commandTemplate", filteredData);
            $("body").append(commandHtml);
            var playerHtml = render("animationPlayer");
            $("#graphics").append(playerHtml);
        }
    }
});

function getInfo(data, current) {
	var categories = data.categories;
	for (var i = 0; i < categories.length; i++) {
		var subCategories = categories[i].subCategories;
		for (var j = 0; j < subCategories.length; j++) {
			if (subCategories[j].id == current) {
				console.log(subCategories[j].info);
				return subCategories[j].info || undefined;
			}
		}
	}
}

function filterDataToSubCategory(data, current) {
    var categories = data.categories;

    for (var i = 0; i < categories.length; i++) {
        var subCategories = categories[i].subCategories;
        for (var j = 0; j < subCategories.length; j++) {
            if (subCategories[j].id == current)
                return subCategories[j];
        }
    }
}