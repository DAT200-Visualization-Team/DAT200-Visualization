var input = [60, 30, 90, 20, 80, 70, 10, 100, 25, 15, 75, 45];

var barWidth = 40;
var width = (barWidth + 10) * input.length;
var height = 350;

var code = d3.select("#code-text");
var barChart = d3.select(".drawingArea")
    .append("svg:svg")
    .attr("width", width + 200)
    .attr("height", height + 200)
    .attr("id", "barChart");

var positions = [];
var textPositions = [];

createRects(input);

//Pivot marker left
var pivotMarkerLeft;

//Pivot marker Right
var pivotMarkerRight;

//Panning
var pan = d3.zoom()
    .on("zoom", panning);

barChart.call(pan);

var codeDisplayManager = new CodeDisplayManager('javascript', 'quickSort');

function createRects(data) {
    positions = [];
    textPositions = [];

    barChart.selectAll("rect")
        .data(data)
        .enter()
        .append("svg:rect")
        .attr("x", function(d, index) { return index * (width / data.length) + 100; })
        .attr("y", function (d) { return height - (d/Math.max.apply(null, data)) * 250 - 50; })
        .attr("height", function (d) { return d / Math.max.apply(null, data) * 250; })
        .attr("width", barWidth)
        .attr("class", function(d, i) { return "element" + i})
        .attr("fill", function(d) { return "red"; });


    barChart.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) { return d; })
        .attr("x", function(d, index) { return index * (width / data.length) + barWidth / 4 + 100; })
        .attr("y", height - 30 )
        .attr("width", barWidth)
        .attr("class", function (d, i) { return "element" + i });

    pivotMarkerLeft = barChart.append("polygon")
        .attr("fill", "yellow")
        .attr("stroke", "blue")
        .attr("stroke-width", "2")
        .attr("points", "05,30 15,10 25,30")
        .attr("opacity", "0")
        .attr("id", "pivotMarkerLeft");

    pivotMarkerRight = barChart.append("polygon")
        .attr("fill", "yellow")
        .attr("stroke", "blue")
        .attr("stroke-width", "2")
        .attr("points", "05,30 15,10 25,30")
        .attr("opacity", "0")
        .attr("id", "pivotMarkerRight")

    for(var i = 0; i < data.length; i++) {
        positions.push([i * (width / data.length) + 100, height - (data[i]/Math.max.apply(null, data)) * 250 - 50]);
        textPositions.push([i * (width / data.length) + barWidth / 4 + 100, height - 30]);
    }
}

function panning() {
    barChart.attr("transform", d3.event.transform);
}

function startMedianOfThree() {
    codeDisplayManager.loadFunctions('quickSortMedianOfThree', 'partition', 'insertionSort');
    codeDisplayManager.changeFunction('quickSortMedianOfThree');
    sort(true);
}

function startMedianOfOne() {
    codeDisplayManager.loadFunctions('quickSortLeftPivot', 'partition', 'insertionSort');
    codeDisplayManager.changeFunction('quickSortLeftPivot');
    sort(false);
}

function sort(median) {
    $('#barChart').empty();
    createRects(input)
    var qs = new QuickSort(input.slice());
    qs.sort(median);
}

function markPivot(a, pivot, line) {
    var text = barChart.selectAll("text").filter(".element" + a);
    var translation = getTranslate(text);
    
    var targetX = textPositions[a][0] - 7;
    var targetY = textPositions[a][1];

    if(pivot == 'left') {
        appendAnimation(line, [{ e: '#pivotMarkerLeft', p: { attr: { opacity: 1 }, x: targetX, y: targetY }, o: { duration: 1 } }], codeDisplayManager);
    } else {
        appendAnimation(line, [{ e: '#pivotMarkerRight', p: { attr: { opacity: 1 }, x: targetX, y: targetY }, o: { duration: 1 } }], codeDisplayManager);
    }
    return true;
}

function highlightPivot(index) {
    removeHighlightPivot();
    appendAnimation(null, [{ e: $('.element' + index).filter('rect'), p: { attr: {stroke:'green', 'stroke-width': 5}}, o: {duration:1}}], null);
}

function removeHighlightPivot() {
    appendAnimation(null, [{ e: '#barChart rect', p: { attr: { stroke: 'none' } }, o: { duration: 1 } }], null);
}

function swap(a, b, line) {
    var elementA = $(".element" + a);
    var elementB = $(".element" + b);

    appendAnimation(line, [
        { e: elementA.filter("rect"), p: { attr: { x: positions[b][0] } }, o: { duration: 1 } },
        { e: elementA.filter("text"), p: { attr: { x: positions[b][0] + barWidth / 4 } }, o: { duration: 1, position: '-=1' } },
        { e: elementB.filter("rect"), p: { attr: { x: positions[a][0] } }, o: { duration: 1, position: '-=1' } },
        { e: elementB.filter("text"), p: { attr: { x: positions[a][0] + barWidth / 4 } }, o: { duration: 1, position: '-=1' } }
    ], codeDisplayManager);

    elementA.attr('class', 'element' + b);
    elementB.attr('class', 'element' + a);
}

function colorPartition(from, to, direction, line) {
    var animations = [];

    for(var i = from; i <= to; i++) {
        var element = d3.select(".element" + i);
        var currentTranslation = getTranslate(element);
        var y = parseInt(currentTranslation[1]);
        var x = parseInt(currentTranslation[0]);
        y = y + 50;
        var delta;

        if(direction == "left") {
            x = x - 50/(y/50);
            delta = -50 / (y / 50);
        } else if(direction == "right") {
            x = x + 50/(y/50);
            delta = 50 / (y / 50);
        }

        textPositions[i][0] += delta;
        textPositions[i][1] += 50;

        animations.push({ e: $("#barChart .element" + i), p: { x: '+=' + delta, y: '+=50' }, o: { duration: 1, position: '-=1' } })
    }
    animations[0].o.position = '+=0';
    appendAnimation(line, animations, codeDisplayManager);

    hideArrows();
}

function hideArrows() {
    appendAnimation(null, [{ e: '#pivotMarkerLeft, #pivotMarkerRight', p: { attr: { opacity: "0" } }, o: { duration: 1, position: '-=1' } }], null);
}

function getTranslate(element) {
    var transformString = element.attr("transform");
    if(transformString != "" && transformString != null) {
        var res = transformString.substring(transformString.indexOf("(")+1, transformString.indexOf(")")).split(",");
        if(res[4] == null) res[4] = 0;
        if(res[5] == null) res[5] = 0;
        return res;
    }
    return [0, 0, 0, 0, 0, 0];
}

function merge(line) {
    appendAnimation(line, [{ e: '#barChart rect, #barChart text', p: { x: 0, y: 0 }, o: { duration: 1 } }], codeDisplayManager);
}

function highlight(a, b, colorA, colorB, line) {
    colorA = colorA || "blue";
    colorB = colorB || "blue";

    var elementA = $(".element" + a).filter("rect");
    var elementB = $(".element" + b).filter("rect");

    appendAnimation(line, [
        { e: elementA.filter("rect"), p: { attr: { fill: colorA } }, o: { duration: 1 } },
        { e: elementB.filter("rect"), p: { attr: { fill: colorB } }, o: { duration: 1, position: '-=1' } }
    ], codeDisplayManager);

    return true;
}

function clearAllHighlight() {
    appendAnimation(null, [{ e: '#barChart rect', p: { attr: { fill: "red" } }, o: { duration: 1 } }], null);
}

function clearHighlight(element, origColor) {
    origColor = origColor || "red";
    appendAnimation(null, [{ e: $(".element" + element).filter("rect"), p: { attr: { fill: origColor } }, o: { duration: 1 } }], null);
}

