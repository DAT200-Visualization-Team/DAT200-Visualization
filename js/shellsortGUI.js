var data = [35, 33, 42, 10, 14, 19, 20, 40];
//var data = [10, 20, 30, 40];

var barWidth = 40;
var width = (barWidth + 10) * data.length;
//var width = 500;
var height = 350;

//Array size
var arrElementWidth = 50;
var arrElementHeight = 50;

//Animation
var cmd = [];
var currentCmd = 0;

//Max value in dataset
var maxValue = Math.max.apply(null, data);

//PH - Code TODO get code from another source
var codeContent = [
    "",
    "function shellSort(a) {",
    "    for(var gap = a.length / 2; gap > 0;",
    "        gap = gap === 2 ? 1 : parseInt(gap / 2.2)) {",
    "",
    "        for(var i = gap; i < a.length; i++) {",
    "            var tmp = a[i];",
    "",
    "            for(var j = i; j >= gap && tmp < a[j - gap]; j-= gap) {",
    "                a[j] = a[j - gap];",
    "            }",
    "            a[j] = tmp;",
    "        }",
    "    }",
    "    return a;",
    "}"
];

var code = d3.select("#code-text");
var drawingArea = d3.select(".drawingArea")
    .append("svg:svg")
    .attr("width", width)
    .attr("height", height);
var array = drawingArea.append("g");

//Create unsorted array
array.selectAll("rect")
    .data(data)
    .enter()
    .append("svg:rect")
    .attr("x", function(d, index) { return index * (width / data.length); })
    .attr("y", function(d) { return 0; })
    .attr("height", arrElementHeight)
    .attr("width", arrElementWidth - 5)
    .attr("fill", "rgb(255, 0, 127)")
    .attr("class", function(d, i) { return "element" + i});

array.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function(d) { return d; })
    .attr("x", function(d, index) { return index * (width / data.length) + arrElementWidth / 3; })
    .attr("y", 30)
    .attr("width", barWidth)
    .attr("class", function(d, i) { return "element" + i});

$( document ).ready(function() {
    initCode();
});

$(document).on("sort", function(event, newCommands) {
    console.log("sorted");
    console.log(newCommands);
    cmd = newCommands.split('!');
});

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
        console.log(selector);

        array.selectAll("rect").filter(selector)
            .transition()
            .duration(1000)
            .attr("transform", "translate(0, " + (k * 1.2 * arrElementHeight) + ")");
        array.selectAll("text").filter(selector)
            .transition()
            .duration(1000)
            .attr("transform", "translate(0, " + (k * 1.2 * arrElementHeight) + ")");
    }
}

function mergeSublists() {
    array.selectAll("rect, text")
        .transition()
        .duration(1000)
        .attr("transform", "translate(0,0)");
}

function highlight(a, b, color) {
    color = color || "rgb(0, 255, 0)";
    array.selectAll("rect").filter(".element" + a)
        .transition()
        .duration(500)
        .attr("fill", "rgb(0,0,255)");
    array.selectAll("rect").filter(".element" + b)
        .transition()
        .duration(500)
        .attr("fill", color);
}

function swap(a, b) {
    var bar1 = array.selectAll("rect").filter(".element" + a);
    var bar2 = array.selectAll("rect").filter(".element" + b);
    var bar1Text = array.selectAll("text").filter(".element" + a);
    var bar2Text = array.selectAll("text").filter(".element" + b);

    //temp vars
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

function clearHighlight() {
    array.selectAll("rect")
        .transition()
        .duration(500)
        .attr("fill", "rgb(255, 0, 127)");
}

function runCommand() {
    console.log(cmd[currentCmd]);
    unHighlightCode();
    switch(cmd[currentCmd].substring(0, Math.min(cmd[currentCmd].length, 4))) {
        case "swap":
            eval(cmd[currentCmd]);
            break;
        case "subl":
            eval(cmd[currentCmd]);
            break;
        case "merg":
            eval(cmd[currentCmd]);
            break;
        case "high":
            //clearHighlight();
            eval(cmd[currentCmd]);
            break;
        case "code":
            eval(cmd[currentCmd]);
            break;
        case "clea":
            eval(cmd[currentCmd]);
            break;
        default:
            console.log("Unknown command" + cmd[currentCmd].substring(0, Math.min(cmd[currentCmd].length, 4)));
    }
    currentCmd++;
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
    //console.log(code);
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
