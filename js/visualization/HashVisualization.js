var data = ["", "", "", "", "", "", "", "", "", "", ""];
var table = new HashSet();
//var data = table.array;

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
//var cmd = [];
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

//Hash function
var hashFunctionBlock = drawingArea.append("g");

hashFunctionBlock.append("rect")
    .attr("width", blockWidth)
    .attr("height", blockHeight)
    .attr("x", width - arrElementWidth - keyWidth - blockWidth - blockMargin)
    .attr("fill", "cornflowerblue");

hashFunctionBlock.append("text")
    .attr("width", blockWidth)
    .attr("height", blockHeight)
    .attr("y", blockHeight-10)
    .attr("x", width + 10 - arrElementWidth - keyWidth - blockWidth - blockMargin)
    .text("");

//buckets
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

//Keys
keys.selectAll("rect")
    .data(data)
    .enter()
    .append("svg:rect")
    .attr("x", function(d, index) { return width - arrElementWidth - keyWidth - keyMargin; })
    .attr("y", function(d, index) { return index * (arrElementHeight + 5); })
    .attr("height", arrElementHeight)
    .attr("width", keyWidth)
    .attr("fill", "rgb(0, 127, 127)")
    .attr("class", function(d, index) { return "key" + index } );

keys.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function(d, index) { return index; })
    .attr("x", function(d, index) { return width + keyWidth/2 - arrElementWidth - keyWidth - keyMargin; })
    .attr("y", function(d, index) { return 2*arrElementHeight/3 + index * (arrElementHeight+5); })
    .attr("width", keyWidth)
    .attr("height", arrElementHeight);

// define arrow markers for graph links
drawingArea.append('defs').append('marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 6)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', 'red');

var arrow = drawingArea.append("path")
    .attr("class", "arrow")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", "4")
    .attr("opacity", "0")
    .style('marker-end','url(#end-arrow)');

function updateArrow(index) {
    unhighlightKey();
    //The data for our line
    var lineData = [{ "x": arrElementWidth,   "y": height/2 + arrElementHeight/2},
        { "x": width + 30 - blockWidth - arrElementWidth - keyWidth - blockMargin,  "y": height/2 + arrElementHeight/2},
        { "x": width - 30 - arrElementWidth - keyWidth - blockMargin,  "y": index * (arrElementHeight+5) + arrElementHeight/2},
        { "x": width - arrElementWidth - keyWidth - keyMargin,  "y": index * (arrElementHeight+5) + arrElementHeight/2}];

    var lineFunction = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

    arrow.transition()
        .duration(1000)
        .attr("d", lineFunction(lineData))
        .attr("opacity", "1");

    highlightKey(index);
}

function getElementHeigth(length) {
    if(length <= 10) return 40;

    return height / length-5;
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
    hideHash();

    bucket.append("rect")
        .attr("width", arrElementWidth)
        .attr("height", arrElementHeight)
        .attr("fill", "BlueViolet")
        .attr("opacity", "0")
        .attr("class", "newElement")
        .attr("y", height/2);

    bucket.append("text")
        .attr("width", arrElementWidth)
        .attr("height", arrElementHeight)
        .attr("x", arrElementWidth/2)
        .attr("y", height/2 + 2*arrElementHeight/3)
        .text( function() {
            if(arrElementHeight > 15) return value;
            return "";
        })
        .attr("opacity", "0")
        .attr("class", "newElement");

    bucket.selectAll(".newElement").transition()
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

function replaceElement(index) {
    bucket.selectAll(".element" + index)
        .transition()
        .delay(1000)
        .duration(0)
        .remove();

    drawingArea.selectAll(".newElement").filter("rect")
        .attr("class", "element" + index)
        .transition()
        .duration(1000)
        .attr("x", width - arrElementWidth)
        .attr("y", index * (arrElementHeight + 5));


    drawingArea.selectAll(".newElement").filter("text")
        .attr("class", "element" + index)
        .transition()
        .duration(1000)
        .attr("x", width - arrElementWidth/2)
        .attr("y", 2*arrElementHeight/3 + index * (arrElementHeight+5));

    drawingArea.selectAll(".newElement").classed(".newElement", false);
}

function highlightKey(index) {
    keys.selectAll("rect").filter(":nth-child(" + (index+1) + ")")
        .transition()
        .duration(500)
        .attr("stroke", "red");
}

function unhighlightKey() {
    keys.selectAll("rect")
        .transition()
        .duration(1000)
        .attr("stroke", "none")
}

function removeElement(index) {
    bucket.selectAll("rect").filter(".element" + index)
        .transition()
        .duration(1000)
        .attr("stroke", "red")
        .attr("stroke-width", "2");
}

function displayHash(hashValue, length, offset) {
    hashFunctionBlock.selectAll("text")
        .transition()
        .duration(500)
        .attr("fill", "red")
        .text( function() {
            if(offset == 0) {
                return "Abs(" + hashValue + " % " + length + ") = " + Math.abs(hashValue % length);
            }
            return "Abs(" + hashValue + " % " + length + ") + " + offset + " = " + (Math.abs(hashValue % length) + offset);
        })
        .transition()
        .duration(500)
        .attr("fill", "black");
}

function clearTable() {
    updateTable();
    //bucket.selectAll("rect")
    //    .transition()
    //    .duration(1000)
    //    .attr("stroke", "none");
    //bucket.selectAll("text")
    //    .transition()
    //    .duration(1000)
    //    .text("");

}

function hideHash() {
    hashFunctionBlock.selectAll("text")
        .text("");
}

function run() {
    eval(cmd[currentCmd]);
    currentCmd++;
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
        run();
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

function updateTable() {
    //var data = ["", "", "", "", ""];
    var data = table.array;
    arrElementHeight = getElementHeigth(data.length);
    console.log(data.length);

    bucket.selectAll("rect")
        .remove();
    bucket.selectAll("text")
        .remove();
    keys.selectAll("rect")
        .remove();
    keys.selectAll("text")
        .remove();

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
        .text(function(d) { return ""; })
        .attr("x", function(d, index) { return width - arrElementWidth/2; })
        .attr("y", function(d, index) { return 2*arrElementHeight/3 + index * (arrElementHeight+5); })
        .attr("width", arrElementWidth)
        .attr("height", arrElementHeight)
        .attr("class", function(d, index) { return "element" + index; });

//Keys
    keys.selectAll("rect")
        .data(data)
        .enter()
        .append("svg:rect")
        .attr("x", function(d, index) { return width - arrElementWidth - keyWidth - keyMargin; })
        .attr("y", function(d, index) { return index * (arrElementHeight + 5); })
        .attr("height", arrElementHeight)
        .attr("width", keyWidth)
        .attr("fill", "rgb(0, 127, 127)")
        .attr("class", function(d, index) { return "key" + index } );

    keys.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d, index) { return index; })
        .attr("x", function(d, index) { return width + keyWidth/2 - arrElementWidth - keyWidth - keyMargin; })
        .attr("y", function(d, index) { return 2*arrElementHeight/3 + index * (arrElementHeight+5); })
        .attr("width", keyWidth)
        .attr("height", arrElementHeight);
}

