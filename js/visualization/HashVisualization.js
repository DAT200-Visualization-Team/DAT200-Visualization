var table = new HashSet();

//Array size
var arrElementWidth = 150;
var arrElementHeight = 40;

//Key size
var keyWidth = 50;
var keyMargin = 5;

var width = 800;
var height = DEFAULT_TABLE_SIZE * (arrElementHeight+5);

//Hash function block size
var blockWidth = keyWidth + keyMargin + arrElementWidth;
var blockHeight = DEFAULT_TABLE_SIZE * (arrElementHeight + 5);
var blockMargin = 30;

//Animation
var animationTime = 1/3;
var tl = new TimelineMax();

var code = d3.select("#code-text");
var drawingArea = d3.select("#hash")
    .append("svg:svg")
    .attr("width", $('#graphics').width())
    .attr("height", $('#graphics').height());

var hashFunctionBlock = drawingArea.append("g");
var bucket = drawingArea.append("g");
var keys = drawingArea.append("g");

hashFunctionBlock.attr("id", "hashFunctionBlock");
bucket.attr("id", "bucket");
keys.attr("id", "keys");

hashFunctionBlock.append("rect")
    .attr("width", blockWidth)
    .attr("height", blockHeight)
    .attr("x", width - arrElementWidth - keyWidth - blockWidth - blockMargin)
    .attr("fill", "cornflowerBlue");

hashFunctionBlock.append("text")
    .attr("width", blockWidth)
    .attr("height", blockHeight)
    .attr("y", blockHeight-10)
    .attr("x", width + 10 - arrElementWidth - keyWidth - blockWidth - blockMargin)
    .text("");

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

var arrow = drawingArea.append("path")
    .attr("id", "arrow")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", "4")
    .attr("opacity", "0")
    .style('marker-end','url(#end-arrow)');

//Panning
var pan = d3.zoom()
    .scaleExtent([1/10, 1])
    .on("zoom", panning);

drawingArea.call(pan);

drawingArea.attr("transform", "translate(50,20) scale(0.70)");

function panning() {
    //console.log(d3.event.transform);
    drawingArea.attr("transform", d3.event.transform);
}

function updateArrow(index) {
    unhighlightKey();

    //var targetY = parseInt(keys.selectAll("rect").filter(":nth-child(" + (index+1) + ")").attr("y"));
    var targetY = index * (arrElementHeight + 5);

    var lineData = [{ "x": arrElementWidth,   "y": height/2 + arrElementHeight/2},
        { "x": width + 30 - blockWidth - arrElementWidth - keyWidth - blockMargin,  "y": height/2 + arrElementHeight/2},
        { "x": width - 30 - arrElementWidth - keyWidth - blockMargin,  "y": targetY + arrElementHeight/2},
        { "x": width - arrElementWidth - keyWidth - keyMargin,  "y": targetY + arrElementHeight/2}];

    var lineFunction = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

    tl.to($("#arrow"), animationTime, {attr:{d: lineFunction(lineData), opacity: "1"}, ease:Linear.easeNone});

    highlightKey(index);
}

/*function highlight(index, array) {
    pointArrow(index);

    tl.to($(array + " rect").filter(), animationTime, {attr:{fill:"cornflowerBlue"}, ease:Linear.easeNone});
    array.selectAll("rect").filter(":nth-child(" + (index+1) + ")")
        .data(data)
        .transition()
        .duration(500)
        .attr("fill", "rgb(255, 0, 0)");
}*/

function clearHighlight(array) {
    tl.to($(array + " rect"), animationTime, {attr:{fill:"cornflowerBlue"}, ease:Linear.easeNone});
}

function add(value) {
    prevOffset = 0;
    hideHash();

    bucket.append("rect")
        .attr("width", arrElementWidth)
        .attr("height", arrElementHeight)
        .attr("fill", "BlueViolet")
        .attr("opacity", "0")
        .attr("class", "newElement")
        .attr("y", height/2)
        .attr("x", 0);

    bucket.append("text")
        .attr("width", arrElementWidth)
        .attr("height", arrElementHeight)
        .attr("x", arrElementWidth/2)
        .attr("y", height/2 + 2*arrElementHeight/3)
        .text(value)
        .attr("opacity", "0")
        .attr("class", "newElement");

    tl.to($("#bucket .newElement"), animationTime, {attr:{opacity:"1"}, ease:Linear.easeNone});
}

function moveToHashFunctionBlock() {
    tl.to($("#hash .newElement").filter("rect"), animationTime, {x:width + 10 - blockWidth - arrElementWidth - keyWidth - blockMargin, ease:Linear.easeNone})
        .to($("#hash .newElement").filter("text"), animationTime, {x:width + 10 - blockWidth - arrElementWidth/2 - keyWidth - blockMargin, ease:Linear.easeNone}, '-=' + animationTime);
}

function replaceElement(index) {
    tl.to($("#bucket").filter(".element" + index), animationTime, {attr:{opacity:"0"}, ease:Linear.easeNone})
        .to($("#hash .newElement").filter("rect"), animationTime, {attr:{x: width - arrElementWidth, y: index * (arrElementHeight + 5)}, ease:Linear.easeNone}, '-=' + animationTime)
        .to($("#hash .newElement").filter("text"), animationTime, {attr:{x: width - arrElementWidth/2, y:2*arrElementHeight/3 + index * (arrElementHeight+5)}, ease:Linear.easeNone}, '-=' + animationTime)
        .to($("#arrow"), animationTime, {attr:{opacity:"0", d:""}, ease:Linear.easeNone}, '-=' + animationTime);

    $("#bucket").filter(".element" + index).attr("class", "removed");
    $("#hash .newElement").attr("class", "element" + index);

    //drawingArea.selectAll(".newElement").classed(".newElement", false);
}

function highlightKey(index) {
    tl.to($("#keys rect").filter(".key" + index), animationTime, {attr:{stroke:"red"}, ease:Linear.easeNone});
}

function unhighlightKey() {
    tl.to($("#keys rect"), animationTime, {attr:{stroke:"none"}, ease:Linear.easeNone});
}

function removeElement(index) {
    tl.to($("#bucket rect").filter(".element" + index), animationTime, {attr:{stroke:"red", "stroke-width": "2"}, ease:Linear.easeNone});
}

var prevOffset = 0;
function displayHash(hashValue, length, offset) {
    var hashString;
    if(offset == 0) {
        hashString = hashValue + " % " + length + " = " + Math.abs(hashValue % length);
    }
    prevOffset += offset;
    hashString = hashValue + " % " + length + " + " + prevOffset + " = " + (Math.abs(hashValue % length) + prevOffset);

    tl.to($("#hashFunctionBlock text"), animationTime, {attr:{fill:"red"}, text:hashString, ease:Linear.easeNone});
    tl.to($("#hashFunctionBlock text"), animationTime, {attr:{fill:"black"}, ease:Linear.easeNone});
}

function hideHash() {
    tl.to($("#hashFunctionBlock text"), animationTime, {text:"", ease:Linear.easeNone})
}

function renewTable(length) {
    tl.to($("#bucket, #bucket *"), animationTime, {attr:{opacity:"0"}, ease:Linear.easeNone})
        .to($("#keys, #keys *"), animationTime, {attr:{opacity:"0"}, ease:Linear.easeNone}, '-=' + animationTime);

    $("#bucket *").attr("class", "removed");
    $("#keys *").attr("class", "removed");

    createKeysAndBuckets(length, "0");

    tl.to($("#bucket, #bucket *").filter(":not(.removed)"), animationTime, {attr:{opacity:"1"}, ease:Linear.easeNone})
        .to($("#keys, #keys *").filter(":not(.removed)"), animationTime, {attr:{opacity:"1"}, ease:Linear.easeNone}, '-=' + animationTime);
}

function createKeysAndBuckets(length, opacity) {
    for(var i = 0; i < length; i++) {
        bucket.append("rect")
            .attr("x", width - arrElementWidth)
            .attr("y", i * (arrElementHeight + 5))
            .attr("height", arrElementHeight)
            .attr("width", arrElementWidth)
            .attr("fill", "cornflowerBlue")
            .attr("opacity", opacity)
            .attr("class", "element" + i);

        bucket.append("text")
            .text("")
            .attr("x", width - arrElementWidth/2)
            .attr("y", 2*arrElementHeight/3 + i * (arrElementHeight+5))
            .attr("width", arrElementWidth)
            .attr("height", arrElementHeight)
            .attr("opacity", opacity)
            .attr("text-anchor", "middle")
            .attr("class", "element" + i);

        //Key
        keys.append("rect")
            .attr("x", width - arrElementWidth - keyWidth - keyMargin)
            .attr("y", i * (arrElementHeight + 5))
            .attr("height", arrElementHeight)
            .attr("width", keyWidth)
            .attr("fill", "cornflowerBlue")
            .attr("opacity", opacity)
            .attr("class", "key" + i);

        keys.append("text")
            .text(i)
            .attr("x", width + keyWidth/2 - arrElementWidth - keyWidth - keyMargin)
            .attr("y", 2*arrElementHeight/3 + i * (arrElementHeight+5))
            .attr("width", keyWidth)
            .attr("height", arrElementHeight)
            .attr("opacity", opacity);
    }
}

