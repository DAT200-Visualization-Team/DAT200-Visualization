var set = new HashSet();

//Array size
var arrElementWidth = 150;
var arrElementHeight = 40;

//Key size
var keyWidth = 50;
var keyMargin = 5;

var width = 800;
var height = DEFAULT_TABLE_SIZE * (arrElementHeight + 5);

//Hash function block size
var blockWidth = keyWidth + keyMargin + arrElementWidth;
var blockHeight = DEFAULT_TABLE_SIZE * (arrElementHeight + 5);
var blockMargin = 30;

var codeDisplayManager = new CodeDisplayManager('javascript', 'hashSet');

var drawingArea;

var hashFunctionBlock;
var bucket;
var keys;
var newestElement;

var arrow;

//Panning
var pan;

$(document).ready(function () {
    drawingArea = d3.select("#hash")
    .append("svg:svg")
    .attr("width", $('#graphics').width())
    .attr("height", $('#graphics').height())
    .append('g');

    hashFunctionBlock = drawingArea.append("g");
    keys = drawingArea.append("g");
    bucket = drawingArea.append("g");

    hashFunctionBlock.attr("id", "hashFunctionBlock");
    keys.attr("id", "keys");
    bucket.attr("id", "bucket");

    hashFunctionBlock.append("rect")
        .attr("width", blockWidth)
        .attr("height", blockHeight)
        .attr("x", width - arrElementWidth - keyWidth - blockWidth - blockMargin)
        .attr("fill", "cornflowerBlue");

    hashFunctionBlock.append("text")
        .attr("width", blockWidth)
        .attr("height", blockHeight)
        .attr("y", blockHeight - 10)
        .attr("x", width + 10 - arrElementWidth - keyWidth - blockWidth - blockMargin)
        .text("")
        .attr("class", 'noselect');

    createKeysAndBuckets(DEFAULT_TABLE_SIZE, "1");

    // arrow marker
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

    arrow = drawingArea.append("path")
        .attr("id", "arrow")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", "4")
        .attr("opacity", "0")
        .style('marker-end', 'url(#end-arrow)');

    pan = d3.zoom()
        .scaleExtent([1 / 10, 1])
        .on("zoom", panning);

    drawingArea.call(pan);

    drawingArea.attr("transform", "translate(50,20) scale(0.70)");
});

function runAdd(x, probing) {
    if (probing == 'Quadratic')
        set.probingType == 'quadratic';
    else
        set.probingType == 'linear';

    codeDisplayManager.loadFunctions('add', 'rehash');
    codeDisplayManager.changeFunction('add');
    set.add(x);
}

function runRemove(x, probing) {
    codeDisplayManager.loadFunctions('remove', 'rehash', 'add');
    codeDisplayManager.changeFunction('remove');
    set.remove(x);
}

function panning() {
    drawingArea.attr("transform", d3.event.transform);
}

function updateArrow(index) {
    unhighlightKey();

    var targetY = index * (arrElementHeight + 5);

    var lineData = [{ "x": arrElementWidth, "y": height / 2 + arrElementHeight / 2 },
        { "x": width + 30 - blockWidth - arrElementWidth - keyWidth - blockMargin, "y": height / 2 + arrElementHeight / 2 },
        { "x": width - 30 - arrElementWidth - keyWidth - blockMargin, "y": targetY + arrElementHeight / 2 },
        { "x": width - arrElementWidth - keyWidth - keyMargin, "y": targetY + arrElementHeight / 2 }];

    var lineFunction = d3.line()
        .x(function (d) { return d.x; })
        .y(function (d) { return d.y; });

    appendAnimation(null, [{ e: '#arrow', p: { attr: { d: lineFunction(lineData), opacity: 1 } }, o: { duration: 1 } }], null);

    highlightKey(index);
}

function clearHighlight(array) {
    appendAnimation(null, [{ e: $(array + " rect"), p: { attr: { fill: "cornflowerBlue" } }, o: { duration: 1 } }], null);
}

function add(value) {
    prevOffset = 0;
    hideHash();

    newestElement = bucket.append("svg:g")
        .attr("transform", "translate(0," + height / 2 + ")")
        .attr("class", "newElement")
        .attr("opacity", 0);

    newestElement.append("rect")
        .attr("width", arrElementWidth)
        .attr("height", arrElementHeight)
        .attr("fill", "#9c6dfc");

    newestElement.append("text")
        .style("text-anchor", "middle")
        .attr("x", arrElementWidth / 2)
        .attr("y", arrElementHeight / 2 + 7)
        .text(value)
        .style("font-size", "22px")
        .style("font-weight", "bold");

    appendAnimation(null, [{ e: newestElement.node(), p: { attr: { opacity: "1" } }, o: { duration: 1 } }], null);
}

function moveToHashFunctionBlock() {
    appendAnimation(null, [
        { e: newestElement.node(), p: { x: width + 10 - blockWidth - arrElementWidth - keyWidth - blockMargin }, o: { duration: 1 } },
        { e: $("#arrow"), p: { attr: { opacity: 0, d: "" } }, o: { duration: 1, position: '-=1' } }
    ], null);
}

function replaceElement(index) {
    
    moveToHashFunctionBlock();

    appendAnimation(6, [
        { e: $("#bucket").filter(".element" + index), p: { attr: { opacity: 0 } }, o: { duration: 1 } },
        { e: newestElement.node(), p: { x: width - arrElementWidth, y: index * (arrElementHeight + 5) }, o: { duration: 1, position: '-=1' } },
    ], codeDisplayManager);

    $("#bucket").filter(".element" + index).attr("class", "removed");
    $(newestElement).attr("class", "element" + index);
}

function highlightKey(index) {
    appendAnimation(null, [{ e: $("#keys rect").filter(".key" + index), p: { attr: { stroke: "red" } }, o: { duration: 1 } }], null);
}

function unhighlightKey() {
    appendAnimation(null, [{ e: $("#keys rect"), p: { attr: { stroke: "none" } }, o: { duration: 1 } }], null);
}

function removeElement(index) {
    appendAnimation(4, [
        { e: $(".element" + index), p: { attr: { stroke: "red", "stroke-width": "2" } }, o: { duration: 1 } },
        { e: $("#arrow"), p: { attr: { opacity: 0, d: "" } }, o: { duration: 1, position: '-=1' } }
    ], codeDisplayManager);
}

var prevOffset = 0;
function displayHash(hashValue, length, offset) {
    var hashString;
    if (set.probingType != "quadratic") {
        if (offset == 0) {
            hashString = hashValue + " % " + length + " = " + Math.abs(hashValue % length);
        }
        prevOffset += offset;
        hashString = hashValue + " % " + length + " + " + prevOffset + " = " + (Math.abs(hashValue % length) + prevOffset);
    } else {
        if (offset == 0) {
            hashString = hashValue + " % " + length + " = " + Math.abs(hashValue % length);
        }
        prevOffset += offset;
        hashString = hashValue + " % " + length + " + " + offset + " * " + offset + " = " + (Math.abs(hashValue % length) + offset * offset);
    }

    appendAnimation(null, [
        { e: $("#hashFunctionBlock text"), p: { attr: { stroke: "red" }, text: hashString }, o: { duration: 1 } },
        { e: $("#hashFunctionBlock text"), p: { attr: { stroke: "black" } }, o: { duration: 1 } }
    ], null);
}

function hideHash() {
    appendAnimation(null, [{ e: $("#hashFunctionBlock text"), p: { text: "" }, o: { duration: 1 } }], null);
}

function renewTable(length) {

    appendAnimation(null, [
        { e: $("#bucket, #bucket *"), p: { attr: { opacity: 0 } }, o: { duration: 1 } },
        { e: $("#keys, #keys *"), p: { attr: { opacity: 0 } }, o: { duration: 1, position: '-=1' } }
    ], null);

    $("#bucket *").attr("class", "removed");
    $("#keys *").attr("class", "removed");

    createKeysAndBuckets(length, "0");

    appendAnimation(3, [
        { e: $("#bucket, #bucket *").filter(":not(.removed)"), p: { attr: { opacity: 1 } }, o: { duration: 1 } },
        { e: $("#keys, #keys *").filter(":not(.removed)"), p: { attr: { opacity: 1 } }, o: { duration: 1, position: '-=1' } }
    ], codeDisplayManager);
}

function createKeysAndBuckets(length, opacity) {
    for (var i = 0; i < length; i++) {
        //Key
        var keyPosX = width - arrElementWidth - keyWidth - keyMargin;
        var keyPosY = i * (arrElementHeight + 5);

        var keyGroup = keys.append("svg:g")
            .attr("transform", "translate(" + keyPosX + "," + keyPosY + ")");

        keyGroup.append("svg:rect")
            .attr("height", arrElementHeight)
            .attr("width", keyWidth)
            .attr("fill", "cornflowerBlue")
            .attr("opacity", opacity)
            .attr("class", "key" + i);

        keyGroup.append("svg:text")
            .text(i)
            .attr("x", keyWidth / 2)
            .attr("y", arrElementHeight / 2 + 7)
            .attr("opacity", opacity)
            .attr("text-anchor", "middle")
            .style("font-size", "22px")
            .style("font-weight", "bold");


        //Bucket
        var valueGroup = bucket.append("svg:g")
            .attr("transform", "translate(" + (width - arrElementWidth) + "," + i * (arrElementHeight + 5) + ")")
            .attr("class", "element" + i)
            .attr("opacity", opacity);

        valueGroup.append("svg:rect")
            .attr("width", arrElementWidth)
            .attr("height", arrElementHeight)
            .attr("fill", "cornflowerBlue");

        valueGroup.append("svg:text")
            .style("text-anchor", "middle")
            .attr("x", arrElementWidth / 2)
            .attr("y", arrElementHeight / 2 + 7)
            .style("font-size", "22px")
            .style("font-weight", "bold");
    }
}

function highlightCode(lines, functionName) {
    if (functionName)
        codeDisplayManager.changeFunction(functionName);

    appendCodeLines(lines, codeDisplayManager);
}
