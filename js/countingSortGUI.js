var data = [1, 2, 3, 4, 2, 1, 3, 3, 2, 1];

var barWidth = 40;
var width = (barWidth + 10) * data.length;
var height = 350;

//Array size
var arrElementWidth = 50;
var arrElementHeight = 50;

//Animation
var cmd = [];
var currentCmd = 0;

//Max value in dataset
var maxValue = Math.max.apply(null, data);
//Counting array
var countArray = Array.apply(null, Array(maxValue + 1)).map(Number.prototype.valueOf, 0);
//Sorted array
var sortedArray = Array.apply(null, Array(data.length)).map(String.prototype.valueOf, "");

//PH - Code TODO get code from another source
var codeContent = [
    "",
    "function countingSort(array, maxValue) {",
    "    if (array.constructor !== Array || array.length == 0)",
    "        return [];",
    "",
    "    var valueCount = Array.apply(null, Array(maxValue)).map(Number.prototype.valueOf, 0);",
    "    var value;",
    "",
    "    for (var i = 0; i < array.length; i++) {",
    "        value = array[i];",
    "        valueCount[value] += 1;",
    "    }",
    "",
    "    var result = new Array(array.list);",
    "    var index = 0;",
    "    for (var i = 0; i < valueCount.length; i++) {",
    "        for (var j = 0; j < valueCount[i]; j++) {",
    "            result[index] = i;",
    "            index++;",
    "        }",
    "    }",
    "",
    "    return result;",
    "}"
    ];

var code = d3.select("#code-text");

var drawingArea = d3.select(".drawingArea")
    .append("svg:svg");

var unsortedArray;
var countingArray;
var sortedArrayGUI;
var arrowWidth = 10;
var arrowHeight = 50;
var arrowHeadHeight = 10;
var arrow;

createArray(data);

function createArray(array) {
    $("svg").empty();
    data = array;

    //Max value in dataset
    maxValue = Math.max.apply(null, data);
    //Counting array
    countArray = Array.apply(null, Array(maxValue + 1)).map(Number.prototype.valueOf, 0);
    //Sorted array
    sortedArray = Array.apply(null, Array(data.length)).map(String.prototype.valueOf, "");

    width = (barWidth + 10) * data.length;

    drawingArea.attr("width", (barWidth + 10) * Math.max(countArray.length, data.length)).attr("height", height);

    unsortedArray = drawingArea.append("g");

    //Create unsorted array
    unsortedArray.selectAll("rect")
        .data(data)
        .enter()
        .append("svg:rect")
        .attr("x", function (d, index) { return index * (width / data.length); })
        .attr("y", function (d) { return 0; })
        .attr("height", arrElementHeight)
        .attr("width", arrElementWidth - 5)
        .attr("fill", "rgb(0, 127, 127)");

    unsortedArray.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", function (d, index) { return index * (width / data.length) + arrElementWidth / 3; })
        .attr("y", 30)
        .attr("width", barWidth);

    //Create counting array
    countingArray = drawingArea.append("g");
    countingArray.selectAll("rect")
        .data(countArray)
        .enter()
        .append("svg:rect")
        .attr("x", function (d, index) { return index * (width / data.length); })
        .attr("y", function (d) { return height / 3; })
        .attr("height", arrElementHeight)
        .attr("width", arrElementWidth - 5)
        .attr("fill", "rgb(0, 127, 127)");

    countingArray.selectAll("text")
        .data(countArray)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", function (d, index) { return index * (width / data.length) + arrElementWidth / 3; })
        .attr("y", height / 3 + 30)
        .attr("width", barWidth);

    countingArray.selectAll("text.label")
        .data(countArray)
        .enter()
        .append("text")
        .text(function (d, index) { return index })
        .attr("class", "label")
        .attr("x", function (d, index) { return index * (width / data.length) + arrElementWidth / 3; })
        .attr("y", height / 3 + 65)
        .attr("width", barWidth);

    //Create sorted array
    sortedArrayGUI = drawingArea.append("g");
    sortedArrayGUI.selectAll("rect")
        .data(sortedArray)
        .enter()
        .append("svg:rect")
        .attr("x", function (d, index) { return index * (width / data.length); })
        .attr("y", function (d) { return 2 * height / 3; })
        .attr("height", arrElementHeight)
        .attr("width", arrElementWidth - 5)
        .attr("fill", "rgb(0, 127, 127)");

    sortedArrayGUI.selectAll("text")
        .data(sortedArray)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", function (d, index) { return index * (width / data.length) + arrElementWidth / 3; })
        .attr("y", 2 * height / 3 + 30)
        .attr("width", barWidth);

    //Create arrow
    arrow = drawingArea.append("svg")
        .attr('y', arrElementHeight)
        .attr('x', arrElementWidth / 2 - arrowWidth);

    //Arrowhead
    var arrowHead = arrow.append("path")
        .attr("d", d3.symbol()
            .type(d3.symbolTriangle)
            .size(100))
        .attr("stroke", "red")
        .attr("fill", "rgb(255, 0,0)")
        .attr("transform", "translate(" + arrowWidth + "," + arrowHeadHeight + ")");

    //Line
    var line1 = arrow.append("line")
        .attr("x1", arrowWidth)
        .attr("y1", arrowHeadHeight)
        .attr("x2", arrowWidth)
        .attr("y2", arrowHeight)
        .attr("stroke", "red")
        .attr("stroke-width", "4");

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
    countingSort(data.slice(), maxValue+1);
}

function countUpdate(index) {
    countArray[index]++;

    countingArray.selectAll("rect").filter(":nth-child(" + (index+1) + ")")
        .data(countArray)
        .transition()
        .duration(500)
        .attr("fill", "rgb(0, 127, 0)")
        .transition()
        .duration(500)
        .attr("fill", "rgb(0, 127, 127)");

    countingArray.selectAll("text")
        .data(countArray)
        .transition()
        .duration(500)
        .text(function(d) { return d; });
}

function sortedUpdate(index, value) {
    //Highlight current value in counting array
    clearHighlight(countingArray);
    highlight(value, countingArray);
    //Highlight the changes in sorted array
    clearHighlight(sortedArrayGUI);
    highlight(index, sortedArrayGUI);
    sortedArray[index] = value;

    sortedArrayGUI.selectAll("text")
        .data(sortedArray)
        .transition()
        .duration(500)
        .text(function(d) { return d; })
}

function showArrow() {
    arrow.transition()
        .duration(500)
        .attr("opacity", 1);
}

function hideArrow() {
    arrow.transition()
        .duration(500)
        .attr('opacity', 0);
}

function pointArrow(index) {
    arrow.transition()
        .duration(500)
        .attr('x', index * (width / data.length) + arrElementWidth / 3 - arrowWidth / 2);
}

function highlight(index, array) {
    pointArrow(index);
    array.selectAll("rect").filter(":nth-child(" + (index+1) + ")")
        .data(data)
        .transition()
        .duration(500)
        .attr("fill", "rgb(255, 0, 0)");
}

function clearHighlight(array) {
    array.selectAll("rect")
        .data(data)
        .transition()
        .duration(500)
        .attr("fill", function(d) { return "rgb(0, 127, 127)"; });
}

function runCommand() {
    unHighlightCode();
    switch(cmd[currentCmd].substring(0, Math.min(cmd[currentCmd].length, 4))) {
        case "coun":
            eval(cmd[currentCmd]);
            clearHighlight(unsortedArray);
            break;
        case "sort":
            //Hide arrow, no longer needed
            eval(cmd[currentCmd]);
            hideArrow();
            break;
        case "high":
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

