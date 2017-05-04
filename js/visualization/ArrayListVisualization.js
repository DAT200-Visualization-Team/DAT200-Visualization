var data = [35, 33, 42, 10, 14, 19, 20, 40];

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

var arrayList = new ArrayList(data);

//PH - Code TODO get code from another source
var codeContent = [
    "",
    "function Arraylist(a) {",
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
var drawingArea = d3.select(".drawingArea").append("svg:svg");
var arrayGroup;

createArray(data);

function createArray(array) {
    $("g").empty();
    data = arrayList.theItems;

    width = (barWidth + 10) * data.length;

    drawingArea.attr("width", width).attr("height", height);
    arrayGroup = drawingArea.append("g");

    //Create unsorted array
    arrayGroup.selectAll("rect")
        .data(arrayList.theItems)
        .enter()
        .append("svg:rect")
        .attr("x", function (d, index) { return index * (width / data.length); })
        .attr("y", function (d) { return 0; })
        .attr("height", arrElementHeight)
        .attr("width", arrElementWidth - 5)
        .attr("fill", "red")
        .attr("class", function (d, i) { return "element" + i });

    arrayGroup.selectAll("text")
        .data(arrayList.theItems)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", function (d, index) { return index * (width / data.length) + arrElementWidth / 3; })
        .attr("y", 30)
        .attr("width", barWidth)
        .attr("class", function (d, i) { return "element" + i });
}

function redraw() {
    width = (barWidth + 10) * data.length;

    drawingArea.attr("width", width).attr("height", height);

    arrayGroup.selectAll("rect")
        .data(arrayList.theItems)
        .enter()
        .append("svg:rect")
        .attr("x", function (d, index) { return index * (width / data.length); })
        .attr("y", function (d) { return 0; })
        .attr("height", arrElementHeight)
        .attr("width", arrElementWidth - 5)
        .attr("fill", "red")
        .attr("class", function (d, i) { return "element" + i });

    arrayGroup.selectAll("text")
        .data(arrayList.theItems)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", function (d, index) { return index * (width / data.length) + arrElementWidth / 3; })
        .attr("y", 30)
        .attr("width", barWidth)
        .attr("class", function (d, i) { return "element" + i });
}

$( document ).ready(function() {
    initCode();
});

function highlight(a, b, color) {
    color = color || "rgb(0, 255, 0)";
    arrayGroup.selectAll("rect").filter(".element" + a)
        .transition()
        .duration(500)
        .attr("fill", "rgb(0,0,255)");
    arrayGroup.selectAll("rect").filter(".element" + b)
        .transition()
        .duration(500)
        .attr("fill", color);
}

function clearHighlight() {
    arrayGroup.selectAll("rect")
        .transition()
        .duration(500)
        .attr("fill", "rgb(255, 0, 127)");
}

function runCommand() {
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
