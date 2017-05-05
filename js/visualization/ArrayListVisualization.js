var data = [35, 33, 40];

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
var theSizeBlock = drawingArea.append("g");

theSizeBlock.append("rect")
    .attr("width", arrayList.theSize * ((width+12.5) / arrayList.theItems.length))
    .attr("height", arrElementHeight + 40 + 10)
    .attr("fill", "lime");

theSizeBlock.append("text")
    .attr("y", 25)
    .attr("x", 10)
    .text("theSize");

var mainArray = drawingArea.append("g");

createArray(getElements(), 0, true);

function createArray(data, y, addLabels) {
    //$("g").empty();

    width = (barWidth + 10) * data.length;

    drawingArea.transition()
        .duration(250)
        .attr("width", width + 150)
        .attr("height", height);
    //arrayGroup = drawingArea.insert("g",":first-child");
    arrayGroup = mainArray;

    //Create unsorted array
    arrayGroup.selectAll("rect:not([class])")
        .data(data)
        .enter()
        .insert("svg:rect", ":first-child")
        .attr("x", function (d, index) { return index * ((width+20) / data.length) + 5; })
        .attr("y", function (d) { return 40; })
        .attr("transform", "translate(0," + y + ")")
        .attr("height", arrElementHeight)
        .attr("width", arrElementWidth - 5)
        .attr("fill", "red")
        .attr("class", function (d, i) { return "element" + i });

    //if(addLabels) {
        arrayGroup.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .text(function (d) { return ""; })
            .attr("x", function (d, index) { return index * (width / data.length) + arrElementWidth / 3 + 5; })
            .attr("y", 30+40)
            .attr("transform", "translate(0," + y + ")")
            .attr("width", barWidth)
            .attr("class", function (d, i) { return "element" + i });
    //}

    return arrayGroup;
}

function getElements() {
    var displayArr = [];
    for(var i = 0; i < arrayList.capacity; i++) {
        if(arrayList.theItems[i] == undefined) {
            displayArr[i] = "";
        } else {
            displayArr[i] = arrayList.theItems[i];
        }
    }
    console.log(displayArr);
    return displayArr;
}

function add(index, element) {
    mainArray.selectAll("text").filter(".element" + index)
        .attr("opacity", "0")
        .text(element)
        .transition()
        .duration(500)
        .attr("opacity", "1");
}

function move(to, from) {
    var fromText = mainArray.selectAll("text").filter(".element" + from).text();
    mainArray.selectAll("text").filter(".element" + to)
        .text(fromText);
}

function set(index, element) {
    mainArray.selectAll("text").filter(".element" + index)
        .transition()
        .duration(250)
        .attr("opacity", "0")
        .transition()
        .duration(500)
        .text(element)
        .attr("opacity", "1")
}

function extendCapacity(newCapacity) {
    var newArray = Array.apply(0, new Array(newCapacity)).map( function() { return ''; });
    var oldArray = mainArray.selectAll("rect");
    createArray(newArray, 100, false);

    mainArray.selectAll("text")
        .transition()
        .delay(250)
        .duration(500)
        .attr("transform", "translate(0, 100)");

    oldArray.transition()
        .delay(750)
        .duration(250)
        .attr("opacity", "0")
        .transition()
        .delay(1000)
        .duration(0)
        .remove();

    mainArray.selectAll("*")
        .transition()
        .delay(750)
        .duration(250)
        .attr("transform", "translate(0,0)")
}

function updateTheSize(newSize, length) {
    theSizeBlock.selectAll("rect")
        .transition()
        .duration(500)
        .attr("width", newSize * ((width+12.5) / length) + 5);
}

$( document ).ready(function() {
    initCode();
});

function highlight(a, b, color) {
    color = color || "rgb(0, 255, 0)";
    mainArray.selectAll("rect").filter(".element" + a)
        .transition()
        .duration(500)
        .attr("fill", "rgb(0,0,255)");
    mainArray.selectAll("rect").filter(".element" + b)
        .transition()
        .duration(500)
        .attr("fill", color);
}

function clearHighlight() {
    mainArray.selectAll("rect")
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
