var data = [10, 5, 30, 80, 50, 40, 75, 80, 90, 40];

var barWidth = 40;
var width = (barWidth + 10) * data.length;
var height = 300;

//Animation
var cmd = [];
var currentCmd = 0;

//Code
var codeContent = ["function insertionSort(a) {", "for(var p = 1; p < a.length; p++) {", "var tmp = a[p];", "var j = p;",
    "for(; j > 0 && tmp < a[j - 1]; j--) {", "a[j] = a[j - 1];",
    "}", "a[j] = tmp;", "}", "return a;", "}"];

//var x = d3.scaleLinear().domain([0, data.length]).range([0, width]);
//var scaled_y = d3.scaleLinear().domain([0, d3.max(data, function(d)
//{return d;})]).rangeRound([0, height-15]);

var code = d3.select("#code-text");
var barChart = d3.select(".drawingArea").
append("svg:svg").
attr("width", width).
attr("height", height);

console.log("selected");

barChart.selectAll("rect").
data(data).
enter().
append("svg:rect").
attr("x", function(d, index) { return index * (width / data.length); }).
attr("y", function(d) { return height - d - 20; }).
attr("height", function(d) { return d; }).
attr("width", barWidth).
attr("fill", function(d) { return "rgb(" + (d * 3) + ", 0, 0)"; });

barChart.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function(d) { return d; })
    .attr("x", function(d, index) { return index * (width / data.length) + barWidth / 4; })
    .attr("y", height )
    .attr("width", barWidth);


//Test
//Test call sorting algo
function sort() {
    insertionSort(data.slice());
}

$(document).on("sort", function(event, newCommands) {
    console.log("sorted");
    console.log(newCommands);
    cmd = newCommands.split('!');
});

function runCommand() {
        console.log(cmd[currentCmd]);
        switch(cmd[currentCmd].substring(0, Math.min(cmd[currentCmd].length, 4))) {
            case "swap":
                eval(cmd[currentCmd]);
                redraw();
                break;
            case "high":
                clearHighlight();
                eval(cmd[currentCmd]);
                break;
            default:
                console.log("Unknown command" + cmd[currentCmd].substring(0, Math.min(cmd[currentCmd].length, 4)));
        }
        currentCmd++;
}

function redraw() {
    barChart.selectAll("rect").
    data(data).
    transition().
    duration(1000).
    attr("x", function(d, index) { return index * (width / data.length) + barWidth / 4; }).
    attr("y", function(d) { return height - d - 20; }).
    attr("height", function(d) { return d; });
    //attr("fill", function(d) { return "rgb(" + (d * 3) + ", 0, 0)"; });

    barChart.selectAll("text")
        .data(data)
        .transition()
        .duration(1000)
        .text(function(d) { return d; })
        .attr("y", height );
}

function swap(a, b) {
    var temp = data[a];
    data[a] = data[b];
    data[b] = temp;
}

function highlight(a, b, color) {
    color = color || "rgb(0, 255, 0)";
    barChart.selectAll("rect").filter(":nth-child(" + (a+1) + ")")
        .transition()
        .duration(500)
        .attr("fill", color);
    barChart.selectAll("rect").filter(":nth-child(" + (b+1) + ")")
        .transition()
        .duration(500)
        .attr("fill", color);
}

function clearHighlight() {
    barChart.selectAll("rect").
    data(data).
    transition().
    duration(500).
    attr("fill", function(d) { return "rgb(" + (d * 3) + ", 0, 0)"; });
}

function initCode() {
    code.selectAll("span")
        .data(codeContent)
        .enter()
        .append("span")
        .text(function (d) { return d });
}

function highlightCodeLine(lineNr) {
    console.log(code);
    //code.selectAll("span").filter(":nth-child(" + (lineNr) + ")")
        //.transition()
        //.duration(500)
        //.style("background-color", "yellow");
}

