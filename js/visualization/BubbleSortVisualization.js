var data = [10, 5, 30, 80, 50, 40, 75, 80, 90, 40];

var barWidth = 40;
var width = (barWidth + 10) * data.length;
var height = 300;

var code = d3.select("#code-text");
var barChart = d3.select(".drawingArea").append("svg:svg").attr("id", "barChart");

var rects = barChart.append("svg:g").selectAll("rect");
var texts = barChart.append("svg:g").selectAll("text");

var codeDisplayManager = new CodeDisplayManager('javascript', 'bubbleSort');
codeDisplayManager.loadFunctions('bubbleSort');
codeDisplayManager.changeFunction('bubbleSort');

createArray(data);

function createArray(array) {
    $('g').empty();
    data = array;
    width = (barWidth + 10) * data.length;

    barChart.attr("width", width)
    .attr("height", height);

    rects = rects.data(data);
    texts = texts.data(data);

    var r = rects.enter();

    r.append("rect")
        .attr("x", function (d, index) { return index * (width / data.length); })
        .attr("y", function (d) { return height - (d/Math.max.apply(null, data)) * 250 - 20; })
        .attr("height", function (d) { return d / Math.max.apply(null, data) * 250; })
        .attr("width", barWidth)
        .attr("class", function (d, i) { return "element" + i })
        .attr("fill", function (d) { return "red"; });

    var t = texts.enter();

    t.append("text").text(function (d) { return d; })
        .attr("x", function (d, index) { return index * (width / data.length) + barWidth / 4; })
        .attr("y", height)
        .attr("width", barWidth)
        .attr("class", function (d, i) { return "element" + i });
}

function startSorting() {
    createArray(data);
    sort();
}

function sort() {
    bubbleSort(data.slice());
}

