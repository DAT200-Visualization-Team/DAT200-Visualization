var data = [40, 30, 20, 10, 80, 60];

var barWidth = 40;
var width = (barWidth + 10) * data.length;
var height = 350;

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
var barChart = d3.select(".drawingArea")
    .append("svg:svg")
    .attr("width", width)
    .attr("height", height);


barChart.selectAll("rect")
    .data(data)
    .enter()
    .append("svg:rect")
    .attr("x", function(d, index) { return index * (width / data.length); })
    .attr("y", function(d) { return height - d - 50; })
    .attr("height", function(d) { return d; })
    .attr("width", barWidth)
    .attr("class", function(d, i) { return "element" + i})
    .attr("fill", function(d) { return "rgb(" + (d * 3) + ", 0, 0)"; });


barChart.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function(d) { return d; })
    .attr("x", function(d, index) { return index * (width / data.length) + barWidth / 4; })
    .attr("y", height - 30 )
    .attr("width", barWidth)
    .attr("class", function(d, i) { return "element" + i});

//Pivot marker Right
var pivotMarkerLeft = barChart.append("svg");
    pivotMarkerLeft.append("polygon")
    .attr("fill", "yellow")
    .attr("stroke",  "blue")
    .attr("stroke-width", "2")
    .attr("points", "05,30 15,10 25,30");
    markPivot(0, "left");

//Pivot marker Left
/*var pivotMarkerRight = barChart.append("svg");
    pivotMarkerRight.append("polygon")
    .attr("fill", "yellow")
    .attr("stroke",  "blue")
    .attr("stroke-width", "2")
    .attr("points", "05,30 15,10 25,30");
    markPivot(data.length - 1, "right");*/

$( document ).ready(function() {
    initCode();
});

$(document).on("sort", function(event, newCommands) {
    console.log("sorted");
    console.log(newCommands);
    cmd = newCommands.split('!');
});
var test;
function sort() {
    test = new QuickSort(data.slice()).sort();
}

function runCommand() {
    console.log(cmd[currentCmd]);
    unHighlightCode();
    switch(cmd[currentCmd].substring(0, Math.min(cmd[currentCmd].length, 4))) {
        case "mark":
            eval(cmd[currentCmd]);
            break;
        case "swap":
            codeLineHighlight(6);
            eval(cmd[currentCmd]);
            //redraw();
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

function markPivot(a, pivot) {
    var currentPivot;
    if(pivot == "left") {
        currentPivot = pivotMarkerLeft;
    } else {
        currentPivot = pivotMarkerRight;
    }
    currentPivot.transition()
        .duration(500)
        .attr('x', a * (width / data.length) + 7) //TODO make sure centered!
        .attr('y', height - 35);
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

function colorPartition(from, to) {
    var selector = "";
    for(var i = from; i <= to; i++) {
        if(i != from) selector += ", ";
        selector = selector + ".element" + i;
    }
    barChart.selectAll("rect").filter(selector)
        .attr("fill", "hsl(" + (Math.random() * 360) + ",100%,50%)")
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

function clearHighlight() {
    barChart.selectAll("rect")
        .data(data)
        .transition()
        .duration(500)
        .attr("fill", function(d) { return "rgb(" + (d * 3) + ", 0, 0)"; });
}

function play() {
    setTimeout(function(){
        //runCommand();
        eval(commands[currentCmd]);
        currentCmd++;
        //Run next command if there is one
        if(currentCmd < commands.length) play();
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

