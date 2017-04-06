var data = ["", "", "", "", "", "", "", "", "", "", ""];

//Array size
var arrElementWidth = 150;
var arrElementHeight = 40;

//Key size
var keyWidth = 50;
var keyHeight = arrElementHeight;
var keyMargin = 5;

var width = 800;
var height = data.length * (arrElementHeight+5);

//Hash function block size
var blockWidth = keyWidth + keyMargin + arrElementWidth;
var blockHeight = data.length * (arrElementHeight + 5);
var blockMargin = 30;

//Animation
var cmd = [];
var currentCmd = 0;

var lineData;

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
    .append("svg:svg")
    .attr("width", width)
    .attr("height", height);
var bucket = drawingArea.append("g");
var keys = drawingArea.append("g");

//Create unsorted array
bucket.selectAll("rect")
    .data(data)
    .enter()
    .append("svg:rect")
    .attr("x", function(d, index) { return width - arrElementWidth; })
    .attr("y", function(d, index) { return index * (arrElementHeight + 5); })
    .attr("height", arrElementHeight)
    .attr("width", arrElementWidth)
    .attr("fill", "rgb(0, 127, 127)")
    .attr("class", function(d, index) { return "element" + index; });

bucket.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function(d) { return d; })
    .attr("x", function(d, index) { return width - arrElementWidth/2; })
    .attr("y", function(d, index) { return 2*arrElementHeight/3 + index * (arrElementHeight+5); })
    .attr("width", arrElementWidth)
    .attr("height", arrElementHeight)
    .attr("class", function(d, index) { return "element" + index; });

keys.selectAll("rect")
    .data(data)
    .enter()
    .append("svg:rect")
    .attr("x", function(d, index) { return width - arrElementWidth - keyWidth - keyMargin; })
    .attr("y", function(d, index) { return index * (arrElementHeight + 5); })
    .attr("height", arrElementHeight)
    .attr("width", keyWidth)
    .attr("fill", "rgb(0, 127, 127)");

keys.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function(d, index) { return index; })
    .attr("x", function(d, index) { return width + keyWidth/2 - arrElementWidth - keyWidth - keyMargin; })
    .attr("y", function(d, index) { return 2*arrElementHeight/3 + index * (arrElementHeight+5); })
    .attr("width", keyWidth)
    .attr("height", arrElementHeight);

var hashFunctionBlock = drawingArea.append("g")
    .append("rect")
    .attr("width", blockWidth)
    .attr("height", blockHeight)
    .attr("x", width - arrElementWidth - keyWidth - blockWidth - blockMargin)
    .attr("fill", "cornflowerblue");

var arrow = drawingArea.append("path")
    .attr("class", "arrow");

function updateArrow(index) {
    //The data for our line
    var lineData = [{ "x": 0,   "y": height/2},
        { "x": width + 10 - blockWidth - arrElementWidth - keyWidth - blockMargin,  "y": height/2},
        { "x": width - arrElementWidth,  "y": index * (arrElementHeight + 5)}];

    var lineFunction = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate("linear");

    arrow.attr("d", lineFunction(lineData));
}

$( document ).ready(function() {
    initCode();
});

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

function add(value) {
    drawingArea.append("rect")
        .attr("width", arrElementWidth)
        .attr("height", arrElementHeight)
        .attr("fill", "rgb(0, 127, 127)")
        .attr("opacity", "0")
        .attr("class", "newElement")
        .attr("y", height/2);

    drawingArea.append("text")
        .attr("width", arrElementWidth)
        .attr("height", arrElementHeight)
        .attr("x", arrElementWidth/2)
        .attr("y", height/2 + 2*arrElementHeight/3)
        .text(value)
        .attr("opacity", "0")
        .attr("class", "newElement");

    drawingArea.selectAll(".newElement").transition()
        .duration(1000)
        .attr("opacity", "1");
}

function moveToHashFunctionBlock() {
    //console.log(drawingArea.select("#newElement"));
    drawingArea.selectAll(".newElement").filter("rect")
        .transition()
        .duration(1000)
        .attr("x", width + 10 - blockWidth - arrElementWidth - keyWidth - blockMargin);
        //.attr("transform", "translate(" + (width + 10 - blockWidth - arrElementWidth - keyWidth - blockMargin) + ")");

    drawingArea.selectAll(".newElement").filter("text")
        .transition()
        .duration(1000)
        .attr("x", width + 10 - blockWidth - arrElementWidth/2 - keyWidth - blockMargin);
}

function checkIfKeyFree(index) {
    drawingArea.selectAll(".newElement")
        .transition()
        .duration(1000)
        //.attr(width + 10 - blockWidth - arrElementWidth - keyWidth - blockMargin)
        .attr("y", index * (arrElementHeight + 5));
        //.attr("transform", "translate(" + (width - blockWidth - arrElementWidth - keyWidth - blockMargin) + ", " + (index * (arrElementHeight + 5))  + ")" );
}

function replaceElement(index) {
    bucket.selectAll(".element" + index).remove();

    drawingArea.selectAll(".newElement").filter("rect")
        .transition()
        .duration(1000)
        .attr("x", width - arrElementWidth)
        .attr("y", index * (arrElementHeight + 5))
        .attr("class", index + "element");

    drawingArea.selectAll(".newElement").filter("text")
        .transition()
        .duration(1000)
        .attr("x", width - arrElementWidth/2)
        .attr("y", 2*arrElementHeight/3 + index * (arrElementHeight+5))
        .attr("class", index + "element");

    drawingArea.selectAll(".newElement").classed(".newElement", false);
}

function runCommand() {
    console.log(cmd[currentCmd]);
    unHighlightCode();
    switch(cmd[currentCmd].substring(0, Math.min(cmd[currentCmd].length, 4))) {
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

