var data = [1, 2, 3, 4, 2, 1, 3, 3, 2, 1];
var codeDisplayManager = new CodeDisplayManager('javascript', 'countingSort');

var barWidth = 40;
var width = (barWidth + 10) * data.length;
var height = 350;

//Array size
var arrElementWidth = 50;
var arrElementHeight = 50;

//Animation
var animationTime = 1;
var tl = new TimelineMax();

//Max value in dataset
var maxValue = Math.max.apply(null, data);
//Counting array
var countArray = Array.apply(null, Array(maxValue + 1)).map(Number.prototype.valueOf, 0);
//Sorted array
var sortedArray = Array.apply(null, Array(data.length)).map(String.prototype.valueOf, "");

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
    countingArray = drawingArea.append("g").attr("id", "countingArray");
    countingArray.selectAll("rect")
        .data(countArray)
        .enter()
        .append("svg:rect")
        .attr("x", function (d, index) { return index * (width / data.length); })
        .attr("y", function (d) { return height / 3; })
        .attr("height", arrElementHeight)
        .attr("width", arrElementWidth - 5)
        .attr("fill", "rgb(0, 127, 127)")
        .attr("class", function(d, i) { return "rect" + i});

    countingArray.selectAll("text")
        .data(countArray)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", function (d, index) { return index * (width / data.length) + arrElementWidth / 3; })
        .attr("y", height / 3 + 30)
        .attr("width", barWidth)
        .attr("class", function(d, i) { return "text" + i});

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
    sortedArrayGUI = drawingArea.append("g").attr("id", "sortedArray");
    sortedArrayGUI.selectAll("rect")
        .data(sortedArray)
        .enter()
        .append("svg:rect")
        .attr("x", function (d, index) { return index * (width / data.length); })
        .attr("y", function (d) { return 2 * height / 3; })
        .attr("height", arrElementHeight)
        .attr("width", arrElementWidth - 5)
        .attr("fill", "rgb(0, 127, 127)")
        .attr("class", function(d, i) { return "rect" + i});

    sortedArrayGUI.selectAll("text")
        .data(sortedArray)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", function (d, index) { return index * (width / data.length) + arrElementWidth / 3; })
        .attr("y", 2 * height / 3 + 30)
        .attr("width", barWidth)
        .attr("class", function(d, i) { return "text" + i});

    //Create arrow
    arrow = drawingArea.append("svg")
        .attr('y', arrElementHeight)
        .attr('x', arrElementWidth / 2 - arrowWidth)
        .attr('id', "arrow");

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
}

function startSorting() {
    codeDisplayManager.loadFunctions("countingSort");
    codeDisplayManager.changeFunction("countingSort");
    createArray(data);
    sort();
}

function sort() {
    countingSort(data.slice(), maxValue+1);
}

function countUpdate(index) {
    countArray[index]++;

    highlightCode([7]);

    var rect = $("#countingArray rect").filter(".rect" + index);
    var text = $("#countingArray text").filter(".text" + index);

    appendAnimation(8, [
        {
            e: rect,
            p: { attr: { fill: "rgb(0, 127, 0)" }, ease: Power2.easeIn },
            o: { duration: animationTime }
        },
        {
            e: text,
            p: { text: countArray[index].toString(), ease: Power2.easeIn },
            o: { duration: animationTime }
        },
        {
            e: rect,
            p: { attr: { fill: "rgb(0, 127, 127)" }, ease: Power2.easeIn },
            o: { duration: animationTime }
        },
    ], codeDisplayManager);
    highlightCode([6]);
}

function sortedUpdate(index, value) {
    //Highlight current value in counting array
    clearHighlight("#countingArray");
    highlight(value, "#countingArray");
    //Highlight the changes in sorted array
    clearHighlight("#sortedArray");
    highlight(index, "#sortedArray");
    sortedArray[index] = value;

    var text = $("#sortedArray text").filter(".text" + index);
    appendAnimation(15, [{
        e: text,
        p: { text: sortedArray[index].toString(), ease: Power2.easeIn },
        o: { duration: animationTime }
    }], codeDisplayManager);

    highlightCode([16, 14]);
}

function showArrow() {
    appendAnimation(null, [{
        e: $("#arrow"),
        p: { attr: { opacity: 1 }, ease: Power2.easeIn },
        o: { duration: animationTime }
    }], null);
}

function hideArrow() {
    appendAnimation(null, [{
        e: $("#arrow"),
        p: { attr: { opacity: 0 }, ease: Power2.easeOut },
        o: { duration: animationTime }
    }], null);
}

function pointArrow(index) {
    appendAnimation(null, [{
        e: $("#arrow"),
        p: { attr: { x: (index * (width / data.length) + arrElementWidth / 3 - arrowWidth / 2) }, ease: Power2.easeIn },
        o: { duration: animationTime }
    }], null);
}

function highlight(index, array) {
    if(array == "#unsortedArray") {
        pointArrow(index);
    } else {
        hideArrow();
    }
    appendAnimation(null, [{
        e: $(array + " rect").filter(".rect" + index),
        p: { attr: { fill: "rgb(255, 0, 0)" }, ease: Power2.easeIn },
        o: { duration: animationTime }
    }], null);
}

function clearHighlight(array) {
    appendAnimation(null, [{
        e: $(array + " rect"),
        p: { attr: { fill: "rgb(0, 127, 127)" }, ease: Power2.easeOut },
        o: { duration: animationTime }
    }], null);
}

function highlightCode(lines) {
    appendCodeLines(lines, codeDisplayManager);
}