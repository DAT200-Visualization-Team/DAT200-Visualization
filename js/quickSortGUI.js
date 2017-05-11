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
var pivotMarkerLeft = barChart.append("polygon")
    .attr("fill", "yellow")
    .attr("stroke",  "blue")
    .attr("stroke-width", "2")
    .attr("points", "05,30 15,10 25,30")
    .attr("opacity", "0")
    .attr("id", "pivotMarkerLeft");
    //markPivot(0, "left");

//Pivot marker Right
var pivotMarkerRight = barChart.append("polygon")
    .attr("fill", "yellow")
    .attr("stroke",  "blue")
    .attr("stroke-width", "2")
    .attr("points", "05,30 15,10 25,30")
    .attr("opacity", "0")
    .attr("id", "pivotMarkerRight");
    //markPivot(input.length-1, "right");

//Panning
var pan = d3.zoom()
    .on("zoom", panning);

barChart.call(pan);

var codeDisplayManager = new CodeDisplayManager('javascript', 'quickSort');

function createRects(data) {
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
        .attr("class", function(d, i) { return "element" + i});

    for(var i = 0; i < data.length; i++) {
        positions.push([i * (width / data.length) + 100, height - (data[i]/Math.max.apply(null, data)) * 250 - 50]);
        textPositions.push([i * (width / data.length) + barWidth / 4 + 100, height - 30]);
    }
}

function panning() {
    barChart.attr("transform", d3.event.transform);
}

function startMedianOfThree() {
    sort(true);
}

function startSingleMedian() {
    sort();
}

var test;
var sorted;
function sort(median) {
    test = new QuickSort(input.slice());
    if(median == true) test.medianOfThree = true;
    sorted = test.sort();
}

function markPivot(a, pivot) {
    var text = barChart.selectAll("text").filter(".element" + a);
    var translation = getTranslate(text);
    
    var targetX = textPositions[a][0] - 7;
    var targetY = textPositions[a][1];

    if(pivot == 'left') {
        tl.to($("#pivotMarkerLeft"), animationTime, {attr:{opacity: "1"}, x: targetX, y: targetY, ease:Linear.easeNone});
    } else {
        tl.to($("#pivotMarkerRight"), animationTime, {attr:{opacity: "1"}, x: targetX, y: targetY, ease:Linear.easeNone});
    }
    return true;
}

function colorElement(from, to, type) {
    var selector = "";
    for(var i = from; i <= to; i++) {
        if(i != from) selector += ", ";
        selector = selector + ".element" + i;
    }
    var elements = barChart.selectAll("rect").filter(selector);
    if(type == "less") {
        tl.to($(selector), animationTime, {attr:{fill:"magenta"}, ease:Linear.easeNone});
    } else {
        tl.to($(selector), animationTime, {attr:{fill:"lime"}, ease:Linear.easeNone});
    }
}

function resetColor(from, to) {
    var selector = "";
    for(var i = from; i <= to; i++) {
        if(i != from) selector += ", ";
        selector = selector + ".element" + i;
    }
    barChart.selectAll("rect").filter(selector)
        .attr("fill", "red");
}

function highlightPivot(index) {
    removeHighlightPivot();
    tl.to($(".element" + index).filter("rect"), animationTime, {attr:{stroke:"green", "stroke-width":"5"}, ease:Linear.easeNone});
}

function removeHighlightPivot() {
    tl.to($("#barChart rect"), 0, {attr:{stroke:"none"}, ease:Linear.easeNone});
}

function swap(a, b) {
    var elementA = $(".element" + a);
    var elementB = $(".element" + b);

    tl.to(elementA.filter("rect"), animationTime, {attr:{x: positions[b][0]}, ease:Linear.easeNone})
        .to(elementA.filter("text"), animationTime, {attr:{x: positions[b][0] + barWidth/4}, ease:Linear.easeNone}, '-=' + animationTime)
        .to(elementB.filter("rect"), animationTime, {attr:{x: positions[a][0]}, ease:Linear.easeNone}, '-=' + animationTime)
        .to(elementB.filter("text"), animationTime, { attr: { x: positions[a][0] + barWidth / 4 }, ease: Linear.easeNone }, '-=' + animationTime);

    elementA.attr('class', 'element' + b);
    elementB.attr('class', 'element' + a);
}

function colorPartition(from, to, direction) {

    for(var i = from; i <= to; i++) {
        var element = d3.select(".element" + i);
        var currentTranslation = getTranslate(element);
        var y = parseInt(currentTranslation[1]);
        var x = parseInt(currentTranslation[0]);
        y = y + 50;
        var test;

        if(direction == "left") {
            x = x - 50/(y/50);
            test = - 50/(y/50);
        } else if(direction == "right") {
            x = x + 50/(y/50);
            test = 50/(y/50);
        }

        textPositions[i][0] += test;
        textPositions[i][1] += 50;
        tl.to($("#barChart .element" + i), animationTime, {x: '+=' + test, y: '+=50'}, 'partition');
    }

    hideArrows();
}

function hideArrows() {
    tl.to($("#pivotMarkerLeft, #pivotMarkerRight"), animationTime, {attr:{opacity:"0"}, ease:Linear.easeNone}, '-=' + animationTime);
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

function merge() {
    tl.to($("#barChart rect, #barChart text"), animationTime, {x:0, y:0, ease:Linear.easeNone});
}

function highlight(a, b, colorA, colorB) {
    colorA = colorA || "blue";
    colorB = colorB || "blue";

    var elementA = $(".element" + a).filter("rect");
    var elementB = $(".element" + b).filter("rect");

    tl.addLabel('highlight')
        .to(elementA.filter("rect"), animationTime, {attr:{fill: colorA}, ease:Linear.easeNone}, 'highlight')
        .to(elementB.filter("rect"), animationTime, {attr:{fill: colorB}, ease:Linear.easeNone}, 'highlight');

    return true;
}

function clearAllHighlight() {
    tl.to($("#barChart rect"), animationTime, {attr:{fill: "red"}, ease:Linear.easeNone});
}

function clearHighlight(element, origColor) {
    origColor = origColor || "red";
    tl.to($(".element" + element).filter("rect"), animationTime, {attr:{fill: origColor}, ease:Linear.easeNone});
}

