// Function for injecting templates from separate files, 
// taken from http://stackoverflow.com/questions/8366733/external-template-in-underscore koorchik's answer, 24.01.2017
function render(tmplName, tmplData) {
    if (!render.tmplCache) {
        render.tmplCache = {};
    }

    if (!render.tmplCache[tmplName]) {
        var tmplDir = "/static/templates";
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

var categoryData = {
    categories: [
    { id: "lists", name: "Lists", subCategories: [{id: "arraylist", name: "Array List"}, {id: "linkedlist", name:"Linked List"}] },
    { id: "sorting", name: "Sorting", subCategories: [{id: "insertionsort", name: "Insertion Sort"}, {id: "mergesort", name: "Merge Sort"}, {id: "bubblesort", name: "Bubble Sort"}, {id: "quicksort", name: "Quick Sort"}] },
    { id: "trees", name: "Trees", subCategories: [{id: "binarytree", name: "Binary Tree"}, {id:"binarysearchtree", name: "Binary Search Tree"}, {id: "binarysearchtreewithrank", name: "Binary Search Tree With Rank"}, {id:"avltree", name: "AVL Tree"}] },
    { id: "graphs", name: "Graphs", subCategories: [{id: "djikstra", name: "Djikstra"}, {id: "bellmanford", name: "Bellman-Ford"}] }
    ]
};

$(document).ready(function () {
    var renderedHeaderHtml = render("headerTemplate", categoryData);
    $("body").prepend(renderedHeaderHtml);

    var currentFile = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
    if (currentFile == "index.html") {
        var renderedIndexContent = render("frontPageContentTemplate", categoryData);
        $("body").append(renderedIndexContent);
    }
});