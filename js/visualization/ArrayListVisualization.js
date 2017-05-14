var data = ["35", "33", "40"];

//var barWidth = 40;

//Array size
var arrElementWidth = 50;
var arrElementHeight = 50;

var width = (arrElementWidth + 10) * data.length;
var height = 350;

var codeDisplayManager = new CodeDisplayManager('javascript', 'arrayList');

var theSize = 3;
var capacity = 5;

var code = d3.select("#code-text");
var drawingArea = d3.select(".drawingArea").append("svg:svg");

var theSizeBlock = drawingArea.append("g");
theSizeBlock.append("rect")
    .attr("width", 0)
    .attr("height", (arrElementHeight + 40 + 10))
    .attr("id", "theSizeBlock")
    .attr("fill", "lime");

theSizeBlock.append("text")
    .attr("y", 25)
    .attr("x", 10)
    .attr("id", "theSizeBlockText")
    .style("opacity", "0")
    .text("theSize");

var mainArray = drawingArea.append("g")
    .attr("id", "mainArray");

var arrayList;
$(document).ready(function () {
    initializeArray(data);
});

function initializeArray(newData) {
    $("#mainArray").empty();
    data = newData;
    var capacity = DEFAULT_CAPACITY;
    while (capacity < data.length) capacity = capacity * 2 + 1;
    createArray(capacity, 0, 0, 1);
    for (var i = 0; i < capacity; i++) {
        if (i < data.length) createTextElement(i, capacity, 0, data[i], 1);
        else createTextElement(i, capacity, 0, "", 1);
    }
    theSizeBlock.selectAll("*").attr("width", data.length * (width / capacity) + 1.25)
        .style("opacity", 1);
    arrayList = new ArrayList();
    arrayList.theItems = data;
    arrayList.capacity = capacity;
    arrayList.theSize = data.length;
}

function runAdd(value) {
    $('.removed').remove();
    codeDisplayManager.loadFunctions('add');
    codeDisplayManager.changeFunction('add');
    arrayList.add(value);
}

function runRemove(index) {
    $('.removed').remove();
    codeDisplayManager.loadFunctions('removeAtPos');
    codeDisplayManager.changeFunction('removeAtPos');
    arrayList.removeAtPos(index);
}

function createArray(length, oldlength, y, opacity) {

    width = (arrElementWidth + 10) * length;

    drawingArea.attr("width", width + 150)
        .attr("height", height);

    for (var i = 0; i < length; i++) {
        mainArray.insert("svg:rect", ":first-child")
            .attr("x", i * ((width) / length) + 5)
            .attr("y", 40)
            .attr("transform", "translate(0," + y + ")")
            .attr("height", arrElementHeight)
            .attr("width", arrElementWidth)
            .attr("fill", "red")
            .style("opacity", opacity)
            .attr("class", "rect" + i);
    }

    for (var j = oldlength; j < length; j++) {
        createTextElement(j, length, y, "", 0);
    }

    if(opacity == 0)
        appendAnimation(3, [{ e: $('#mainArray').find('rect'), p: { opacity: 1 }, o: { duration: 1 } }], codeDisplayManager);
    else
        appendAnimation(null, [{ e: $('#mainArray').find('rect'), p: { opacity: 1 }, o: { duration: 1 } }], null);
}

function createTextElement(elementNr, length, startY, startValue, opacity) {
    mainArray.append("text")
        .text(startValue)
        .attr("x", elementNr * (width / length) + arrElementWidth / 2 + 5)
        .attr("y", 30 + 40)
        .attr("transform", "translate(0," + startY + ")")
        .attr("width", arrElementWidth)
        .attr("text-anchor", "middle")
        .style("opacity", opacity)
        .attr("class", "text" + elementNr);
}

function add(index, textContent) {
    console.log("adding " + textContent + ", to index: " + index);
    var textbox = $(".text" + index);
    if (textbox.length == 0) {
        createTextElement(index, arrayList.capacity, 0, "", 0);
        textbox = $(".text" + index);
    }

    appendAnimation(8, [{ e: textbox, p: { text: { value: textContent }, opacity: 1 }, o: { duration: 1 } }], codeDisplayManager);
}

function move(from, capacity, NewTextNeeded) {
    var element = $(".text" + from);
    var oldElement = $(".text" + (from - 1));
    createTextElement(from, arrayList.capacity, 0, element.text(), 1);

    appendAnimation(3, [
        { e: element, p: { attr: { x: ((from - 1) * (width / capacity) + arrElementWidth / 2 + 5) } }, o: { duration: 1 } },
        { e: oldElement, p: { opacity: 0 }, o: { duration: 1, position: '-=1' } }
    ], codeDisplayManager);

    oldElement.attr('class', "removed");
    element.attr('class', "text" + (from - 1));
}

function set(index, textContent) {
    var textbox = $(".text" + index);
    appendAnimation(null, [{ e: textbox, p: { text: { value: textContent } }, o: { duration: 1 } }], null);
}

function extendCapacity(newCapacity, oldCapacity) {
    var oldArray = $("#mainArray rect");
    highlightCode([2]);
    createArray(newCapacity, oldCapacity, 100, 0);

 /*   for (var j = 0; j < oldCapacity; j++) {
        $(".text" + j).attr('class', "oldText" + j);
        createTextElement(j, oldCapacity, 0, $(".oldText" + j).text(), 1);
    }*/

    for (var i = 0; i < oldCapacity; i++) {
        appendAnimation(5, [{ e: $(".text" + i), p: { y: 100 }, o: { duration: 1 } }], codeDisplayManager);
        highlightCode([4]);
    }

    appendAnimation(null, [{ e: oldArray, p: { opacity: 0 }, o: { duration: 1 } }], null);

    appendAnimation(null, [{ e: $("#mainArray").find("rect, text"), p: { y: 0 }, o: { duration: 1 } }], null);
}

function updateTheSize(newSize, length, line, pos) {
    appendAnimation(line, [{ e: $("#theSizeBlock"), p: { attr: { width: (newSize * (width / length) + 1.25) } }, o: { duration: 1, position: pos ? pos : '+=0' } }], codeDisplayManager);
    
    if (newSize >= 1) {
        appendAnimation(null, [{ e: $("#theSizeBlockText"), p: { opacity: 1 }, o: { duration: 1 } }], null);
    } else {
        appendAnimation(null, [{ e: $("#theSizeBlockText"), p: { opacity: 0 }, o: { duration: 1 } }], null);
    }
}

function highlightCode(lines) {
    appendCodeLines(lines, codeDisplayManager);
}