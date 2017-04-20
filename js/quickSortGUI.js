var input = [60, 30, 90, 20, 80, 70, 10, 100, 25, 15, 75, 45];

var barWidth = 40;
var width = (barWidth + 10) * input.length;
var height = 350;

//Animation
var cmd = [];
var currentCmd = 0;

//PH - Code TODO get code from another source
var codeContent = [
    "",
    "function insertionSort(a) {",
    "    for(var p = 1; p < a.length; p++) {",
    "        var tmp = a[p];",
    "        var j = p;",
    "        for(; j > 0 && tmp < a[j - 1]; j--) {",
    "            a[j] = a[j - 1];",
    "        }",
    "        a[j] = tmp;",
    "    }",
    "    return a;",
    "}"];

var code = d3.select("#code-text");
var barChart = d3.select(".drawingArea")
    .append("svg:svg")
    .attr("width", width + 200)
    .attr("height", height + 200);

createRects(input);

//Pivot marker left
var pivotMarkerLeft = barChart.append("polygon")
    .attr("fill", "yellow")
    .attr("stroke",  "blue")
    .attr("stroke-width", "2")
    .attr("points", "05,30 15,10 25,30");
    //markPivot(0, "left");

//Pivot marker Right
var pivotMarkerRight = barChart.append("polygon")
    .attr("fill", "yellow")
    .attr("stroke",  "blue")
    .attr("stroke-width", "2")
    .attr("points", "05,30 15,10 25,30");
    //markPivot(input.length-1, "right");

//Panning
var pan = d3.zoom()
    .on("zoom", panning);

barChart.call(pan);

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
}

function panning() {
    //barChart.attr("transform", "translate(" + d3.event.transform.x + ", " + d3.event.transform.y + ")");
    barChart.attr("transform", d3.event.transform);
}

$( document ).ready(function() {
    initCode();
});

$(document).on("sort", function(event, newCommands) {
    console.log("sorted");
    console.log(newCommands);
    cmd = newCommands.split('!');
});
var test;
function sort(median) {
    test = new QuickSort(input.slice());
    if(median == true) test.medianOfThree = true;
    test.sort();
}

function runCommand() {
    console.log(cmd[currentCmd]);
    unHighlightCode();
    switch(cmd[currentCmd].substring(0, Math.min(cmd[currentCmd].length, 4))) {
        case "mark":
            eval(cmd[currentCmd]);
            break;
        case "swap":
            codeLineHighlight(6);
            eval(cmd[currentCmd]);
            //redraw();
            break;
        case "high":
            codeLineHighlight(5);
            clearHighlight();
            eval(cmd[currentCmd]);
            break;
        case "code":
            eval(cmd[currentCmd]);
            break;
        default:
            console.log("Unknown command" + cmd[currentCmd].substring(0, Math.min(cmd[currentCmd].length, 4)));
    }
    currentCmd++;
}

function markPivot(a, pivot) {
    //var currentPivot = barChart.selectAll("rect").filter(".element" + a);
    var text = barChart.selectAll("text").filter(".element" + a);
    var translation = getTranslate(text);
    var targetX = parseInt(text.attr("x")) + parseInt(translation[0]) - 7;
    var targetY = parseInt(text.attr("y")) + parseInt(translation[1]);

    if(pivot == 'left') {
        pivotMarkerLeft.transition()
            .duration(500)
            .attr('transform', "translate(" + (targetX) + ", " + targetY + ")");
    } else {
        pivotMarkerRight.transition()
            .duration(500)
            .attr('transform', "translate(" + (targetX) + ", " + targetY + ")");
    }

}

function colorElement(from, to, type) {
    var selector = "";
    for(var i = from; i <= to; i++) {
        if(i != from) selector += ", ";
        selector = selector + ".element" + i;
    }
    var elements = barChart.selectAll("rect").filter(selector);
    if(type == "less") {
        elements.transition()
            .duration(500)
            .attr("fill", "magenta");
    } else {
        elements.transition()
            .duration(500)
            .attr("fill", "lime");
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
    barChart.selectAll("rect").filter(".element" + index)
        .transition()
        .duration(500)
        .attr('stroke', "green")
        .attr('stroke-width', "4");
}

function removeHighlightPivot() {
    barChart.selectAll("rect")
        .attr('stroke', "none");
}

function swap(a, b) {
    var bar1 = barChart.selectAll("rect").filter(".element" + a);
    var bar2 = barChart.selectAll("rect").filter(".element" + b);
    var bar1Text = barChart.selectAll("text").filter(".element" + a);
    var bar2Text = barChart.selectAll("text").filter(".element" + b);
    var oldBar1_X = bar1.attr('x');
    var oldBar1Text_X = bar1Text.attr('x');

    bar1.attr("class", "element" + b)
        .transition()
        .duration(500)
        .attr('x', bar2.attr('x'));
    bar1Text.attr("class", "element" + b)
        .transition()
        .duration(500)
        .attr('x', bar2Text.attr('x'));

    bar2.attr("class", "element" + a)
        .transition()
        .duration(500)
        .attr('x', oldBar1_X);
    bar2Text.attr("class", "element" + a)
        .transition()
        .duration(500)
        .attr('x', oldBar1Text_X);
}

function colorPartition(from, to, direction) {
    //resetColor(from, to);
    var selector = "";
    for(var i = from; i <= to; i++) {
        if(i != from) selector += ", ";
        selector = selector + ".element" + i;
    }
    barChart.selectAll("*").filter(selector)
        //.attr("fill", "hsl(" + (Math.random() * 360) + ",100%,50%)")
        .transition()
        .duration(500)
        .each( function(d, index) {
            d3.select(this)
                .transition()
                .duration(500)
                .attr("transform", function(d, index) {
                    var element = d3.select(this);
                    var currentTranslation = getTranslate(element);
                    var y = parseInt(currentTranslation[1]);
                    var x = parseInt(currentTranslation[0]);
                    y = y + 50;
                    if(direction == "left") {
                        x = x - 50/(y/50);
                    } else if(direction == "right") {
                        x = x + 50/(y/50);
                    }
                    return "translate(" + x + ", " + y + ")";
                });
        });
}

function getTranslate(element) {
    var transformString = element.attr("transform");
    if(transformString != "" && transformString != null) {
        var res = transformString.substring(transformString.indexOf("(")+1, transformString.indexOf(")")).split(",");
        if(res[0] == null) res[0] = 0;
        if(res[1] == null) res[1] = 0;
        return res;
    }
    return [0, 0];
}

function merge() {
    barChart.selectAll("rect")
        .transition()
        .duration(500)
        .attr("transform", "translate(0,0)");

    barChart.selectAll("text")
        .transition()
        .duration(500)
        .attr("transform", "translate(0,0)");
}

function highlight(a, b, color) {
    color = color || "rgb(0, 255, 0)";
    barChart.selectAll("rect").filter(".element" + a)
        .transition()
        .duration(500)
        .attr("fill", "rgb(0,0,255)");
    barChart.selectAll("rect").filter(".element" + b)
        .transition()
        .duration(500)
        .attr("fill", color);
}

function clearHighlight(data) {
    barChart.selectAll("rect")
        .data(data)
        .transition()
        .duration(500);
        //.attr("fill", function(d) { return "rgb(" + (d * 3) + ", 0, 0)"; });
}

function play() {
    setTimeout(function(){
        //runCommand();
        eval(commands[currentCmd]);
        console.log(commands[currentCmd]);
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

