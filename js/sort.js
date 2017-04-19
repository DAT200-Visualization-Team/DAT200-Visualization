var data = [10, 5, 30, 80, 50, 40, 75, 80, 90, 40];

var barWidth = 40;
var width = (barWidth + 10) * data.length;
var height = 300;

//Animation
var cmd = [];
var currentCmd = 0;

//PH - Code TODO get code from another source
var codeContent = [
    "",
    "function insertionSort(a) {",
    "    for(var p = 1; p < a.length; p++) {",
    "        var tmp = a[p];",
    "        var j = p;",
    "        for(; j > 0 && tmp < a[j - 1]; j--) {",
    "            a[j] = a[j - 1];",
    "        }",
    "        a[j] = tmp;",
    "    }",
    "    return a;",
    "}"];

var code = d3.select("#code-text");
var barChart = d3.select(".drawingArea").append("svg:svg");

var rects = barChart.append("svg:g").selectAll("rect");
var texts = barChart.append("svg:g").selectAll("text");

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
        .attr("fill", "red");

    var t = texts.enter();

    t.append("text").text(function (d) { return d; })
        .attr("x", function (d, index) { return index * (width / data.length) + barWidth / 4; })
        .attr("y", height)
        .attr("width", barWidth)
        .attr("class", function (d, i) { return "element" + i });

    cmd = [];
    currentCmd = 0;
}

function startSorting() {
    sort();
    play();
}

$( document ).ready(function() {
    initCode();
});

$(document).on("sort", function(event, newCommands) {
    cmd = newCommands.split('!');
});

function sort() {
    insertionSort(data.slice());
}

function runCommand() {
        unHighlightCode();
        switch(cmd[currentCmd].substring(0, Math.min(cmd[currentCmd].length, 4))) {
            case "swap":
                codeLineHighlight(6);
                eval(cmd[currentCmd]);
                break;
            case "high":
                codeLineHighlight(5);
                clearHighlight();
                eval(cmd[currentCmd]);
                break;
            case "code":
                eval(cmd[currentCmd]);
                break;
            default:
                console.log("Unknown command" + cmd[currentCmd].substring(0, Math.min(cmd[currentCmd].length, 4)));
        }
        currentCmd++;
}

function swap(a, b) {
    var bar1 = barChart.selectAll("rect").filter(".element" + a);
    var bar2 = barChart.selectAll("rect").filter(".element" + b);
    var bar1Text = barChart.selectAll("text").filter(".element" + a);
    var bar2Text = barChart.selectAll("text").filter(".element" + b);
    var oldBar1_X = bar1.attr('x');
    var oldBar1Text_X = bar1Text.attr('x');

    bar1.attr("class", "element" + b)
        .transition()
        .duration(500)
        .attr('x', bar2.attr('x'));
    bar1Text.attr("class", "element" + b)
        .transition()
        .duration(500)
        .attr('x', bar2Text.attr('x'));

    bar2.attr("class", "element" + a)
        .transition()
        .duration(500)
        .attr('x', oldBar1_X);
    bar2Text.attr("class", "element" + a)
        .transition()
        .duration(500)
        .attr('x', oldBar1Text_X);
}

function highlight(a, b, color) {
    color = color || "rgb(0, 255, 0)";
    barChart.selectAll("rect").filter(".element" + a)
        .transition()
        .duration(500)
        .attr("fill", "rgb(0,0,255)");
    barChart.selectAll("rect").filter(".element" + b)
        .transition()
        .duration(500)
        .attr("fill", color);
}

function markAsSorted(a) {
    var selector = ".element" + a;
    if(a == 0) selector = "*";

    barChart.selectAll("rect").filter(selector)
        .transition()
        .duration(500)
        .attr("fill", "rgb(255,0,127)")
        .attr("class", "sorted");
}

function clearHighlight() {
    barChart.selectAll("rect").filter(":not(.sorted)")
        .data(data)
        .transition()
        .duration(500)
        .attr("fill", function(d) { return "rgb(255, 0, 0)"; });
}

function play() {
    setTimeout(function(){
        runCommand();
        //Run next command if there is one
        if(currentCmd < cmd.length) play();
    }, 1000);
}

function initCode() {
    code.selectAll("span")
        .data(codeContent)
        .enter()
        .append("span")
        .attr("id", function(d, i) { return "codeLine" + i})
        .text(function (d) { return d })
        .append("br");

    //Restart code highlightning
    hljs.initHighlighting.called = false;
    hljs.initHighlighting();
}

function codeLineHighlight(lineNr) {
    code.selectAll("span").filter("#codeLine" + lineNr)
        .transition()
        .duration(500)
        .style("background-color", "yellow");
}

function unHighlightCode() {
    code.selectAll("span")
        .transition()
        .duration(500)
        .style("background-color", "transparent");
}
