var data = [35, 33, 42, 10, 14, 19, 20, 40];

//Array size
var arrElementWidth = 50;
var arrElementHeight = 50;

var width = (arrElementWidth + 10) * data.length;
var height = 350;


//Max value in dataset
var maxValue = Math.max.apply(null, data);

var code = d3.select("#code-text");
var drawingArea = d3.select(".drawingArea").append("svg:svg");
var arrayGroup;

createArray(data);

//Animation
var animationTime = 1;
var tl = new TimelineMax();
var codeDisplayManager = new CodeDisplayManager('javascript', 'shellSort');
codeDisplayManager.loadFunctions('shellSort');
codeDisplayManager.changeFunction('shellSort');

function createArray(array) {
    $("g").empty();
    data = array;

    width = (arrElementWidth + 10) * data.length;

    drawingArea.attr("width", width).attr("height", height);
    arrayGroup = drawingArea.append("g").attr("id", "arrayGroup");

    //Create unsorted array
    arrayGroup.selectAll("rect")
        .data(data)
        .enter()
        .append("svg:rect")
        .attr("x", function (d, index) { return index * (width / data.length) + 5; })
        .attr("y", function (d) { return 0; })
        .attr("height", arrElementHeight)
        .attr("width", arrElementWidth)
        .attr("fill", "red")
        .attr("transform", "translate(0,0)")
        .attr("class", function (d, i) { return "element" + i });

    arrayGroup.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", function (d, index) { return index * (width / data.length) + arrElementWidth / 2 + 5; })
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("width", arrElementWidth)
        .attr("transform", "translate(0,0)")
        .attr("class", function (d, i) { return "element" + i });
}

function startSorting() {
    createArray(data);
    sort();
}

function sort() {
    shellSort(data.slice());
}

function sublist(gap) {
    var animations = [];

    for(var k = 0; k < gap; k++) {
        var selector = "";
        for(var i = k; i < data.length; i = i + gap) {
            if(i != k) selector += ", ";
            selector = selector + ".element" + i;
        }

        animations.push({ e: selector, p: { y: (k * 1.2 * arrElementHeight), ease: Power3.easeOut }, o: { duration: 1, position: '-=1' } });
    }
    animations[0].o.position = '+=0';
    appendAnimation(2, animations, codeDisplayManager);
}

function mergeSublists() {
    appendAnimation(3, [{ e: '#arrayGroup rect, #arrayGroup text', p: { y: 0 }, o: { duration: 2 } }], codeDisplayManager);
}

function clearAllHighlight() {
    appendAnimation(null, [{ e: '#arrayGroup rect', p: { attr: { fill: 'red' } }, o: { duration: 1 } }], null);
}