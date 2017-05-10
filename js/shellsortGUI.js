var data = [35, 33, 42, 10, 14, 19, 20, 40];

var barWidth = 40;
var width = (barWidth + 10) * data.length;
var height = 350;

//Array size
var arrElementWidth = 50;
var arrElementHeight = 50;

//Max value in dataset
var maxValue = Math.max.apply(null, data);

var code = d3.select("#code-text");
var drawingArea = d3.select(".drawingArea").append("svg:svg");
var arrayGroup;

createArray(data);

//Animation
var animationTime = 1;
var tl = new TimelineMax();

function createArray(array) {
    $("g").empty();
    data = array;

    width = (barWidth + 10) * data.length;

    drawingArea.attr("width", width).attr("height", height);
    arrayGroup = drawingArea.append("g").attr("id", "arrayGroup");

    //Create unsorted array
    arrayGroup.selectAll("rect")
        .data(data)
        .enter()
        .append("svg:rect")
        .attr("x", function (d, index) { return index * (width / data.length); })
        .attr("y", function (d) { return 0; })
        .attr("height", arrElementHeight)
        .attr("width", arrElementWidth - 5)
        .attr("fill", "rgb(255, 0, 127)")
        .attr("transform", "translate(0,0)")
        .attr("class", function (d, i) { return "element" + i });

    arrayGroup.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", function (d, index) { return index * (width / data.length) + arrElementWidth / 3; })
        .attr("y", 30)
        .attr("width", barWidth)
        .attr("transform", "translate(0,0)")
        .attr("class", function (d, i) { return "element" + i });
}

function startSorting() {
    sort();
}

function sort() {
    shellSort(data.slice());
}

function sublist(gap) {
    for(var k = 0; k < gap; k++) {
        var selector = "";
        for(var i = k; i < data.length; i = i + gap) {
            if(i != k) selector += ", ";
            selector = selector + ".element" + i;
        }

        tl.to($(selector), animationTime, {attr:{transform: "translate(0," + (k * 1.2 * arrElementHeight) + ")"}, ease:Linear.easeNone});
    }
}

function mergeSublists() {
    tl.to($("#arrayGroup rect, #arrayGroup text"), animationTime, {attr:{transform: "translate(0,0)"}, ease:Linear.easeNone});
}

function clearAllHighlight() {
    tl.to($("#arrayGroup rect"), animationTime, {attr:{fill: "rgb(255, 0, 127)"}, ease:Linear.easeNone});
}
