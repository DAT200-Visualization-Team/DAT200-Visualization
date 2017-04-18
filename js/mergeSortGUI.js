var data = [3, 5, 4, 32, 35]; //, 50, 40, 75, 80, 90, 40];

var barWidth = 40;
var width = (barWidth + 60) * data.length;
var height = 500;//300;

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
    .attr("width", width  /*width*/)
    .attr("height", height);


barChart.selectAll("rect")
    .data(data)
    .enter()
    .append("svg:rect")
    .attr("x", function(d, index) { return index * (barWidth * 1.05) + width / data.length; })
    //TODO set the y value in a better way
    .attr("y", function(d) { return - d + 150 })//height - d - 20; })
    .attr("height", function(d) { return d; })
    .attr("width", barWidth)
    .attr("class", function(d, i) { return "element" + i})
    .attr("fill", function(d) { return "rgb(0, 0, 127)"; });


barChart.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function(d) { return d; })
    .attr("x", function(d, index) { return index * (barWidth * 1.05) + barWidth / 4 + width / data.length; })
    .attr("y", function(d) {return 170} )//height )
    .attr("width", barWidth)
    .attr("class", function(d, i) { return "element" + i});

$( document ).ready(function() {
    initCode();
});

$(document).on("sort", function(event, newCommands) {
    console.log("sorted");
    console.log(newCommands);
    cmd = newCommands.split('!');
});

function sort() {
    //insertionSort(data.slice());
    new MergeSort(data.slice()).sort();
}

function split(edge, center, direction) {
    var moveDirection;
    var elementsToMove;
    var start;

    //TODO make this less stupid
    if(direction == "right") {
      //  console.log("Right");
        moveDirection = 1;
        elementsToMove = ".element" + center;
        for(var i = edge; i > center; i--) {
            elementsToMove = elementsToMove + ", .element" + i;
        }
        start = center;
    } else {
        //console.log("Left");
        moveDirection = -1;
        elementsToMove = ".element" + edge;
        for(var i = edge + 1; i <= center; i++) {
            elementsToMove = elementsToMove + ", .element" + i;
        }
        start = edge;
    }
    //TODO change color of regrouped elements
    //console.log(elementsToMove);
    //console.log("from pos: " + parseInt(barChart.selectAll(".element" + edge).attr('x')));
    //console.log("Moving: " + (moveDirection * 30));

    barChart.selectAll("rect").filter(elementsToMove)
        .transition()
        .duration(500)
        .attr('x', function(d, index) { return parseInt(barChart.selectAll(".element" + (index + start)).attr('x')) + moveDirection * 30 })
        .attr('y', function(d, index) { return parseInt(barChart.selectAll(".element" + (index + start)).attr('y')) + 30 });

    barChart.selectAll("text").filter(elementsToMove)
        .transition()
        .duration(500)
        .attr('x', function(d, index) { return parseInt(barChart.selectAll("text").filter(".element" + (index + start)).attr('x')) + moveDirection * 30 })
        .attr('y', function(d, index) { return parseInt(barChart.selectAll("text").filter(".element" + (index + start)).attr('y')) + 30 });

    //console.log("Arrived at: " + parseInt(barChart.selectAll(".element" + edge).attr('x')));
}

function merge(toPos, sourcePos, direction) {
    var moveDirection;
    var elementsToMove = ".element" + sourcePos;
    console.log("merging element nr. " + sourcePos);
    var targetX;
    var textTargetX;

    //TODO make this less stupid
    if(direction == "right") {
        console.log("Right");
        moveDirection = 1;
    } else {
        console.log("Left");
        moveDirection = -1;
    }

    targetX = parseInt(barChart.selectAll(".element" + toPos).attr('x'));
    //textTargetX = parseInt(barChart.selectAll("text").filter(".element" + sourcePos).attr('x')) - moveDirection * 30;
    console.log("TargetX: " + targetX);
    //Test
    console.log("comparing: " + (targetX) + " == " + (barChart.selectAll(".element" + sourcePos).attr('x') - moveDirection * 30));
    if(targetX == parseInt(barChart.selectAll(".element" + sourcePos).attr('x')) - moveDirection * 30) {
        console.log("!!!!!!!!!!!!!!!!!merge conflict!!!!!!!!!!!!!!");
        targetX = targetX + moveDirection * 30 + 15;
        //textTargetX = textTargetX + width / data.length + 5;
    }

    //TODO change color of regrouped elements
    barChart.selectAll("rect").filter(elementsToMove)
        .transition()
        .duration(500)
        .attr('x', function(d, index) { return targetX }/*- moveDirection * 30*/)
        .attr('y', function(d, index) { return parseInt(barChart.selectAll(".element" + sourcePos).attr('y')) - 30 });

    barChart.selectAll("text").filter(elementsToMove)
        .transition()
        .duration(500)
        .attr('x', function(d, index) { return targetX /*- moveDirection * 30 */ + barWidth / 4 })
        .attr('y', function(d, index) { return parseInt(barChart.selectAll("text").filter(".element" + sourcePos).attr('y')) - 30 });
}

function runCommand() {
    console.log(cmd[currentCmd]);
    unHighlightCode();
    switch(cmd[currentCmd].substring(0, Math.min(cmd[currentCmd].length, 4))) {
        case "swap":
            codeLineHighlight(6);
            eval(cmd[currentCmd]);
            //redraw();
            break;
        case "spli":
            eval(cmd[currentCmd]);
            break;
        case "merg":
            eval(cmd[currentCmd]);
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

function clearHighlight() {
    barChart.selectAll("rect")
        .data(data)
        .transition()
        .duration(500)
        .attr("fill", function(d) { return "rgb(" + (d * 3) + ", 0, 0)"; });
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

