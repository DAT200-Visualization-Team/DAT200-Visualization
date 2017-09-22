var input = [60, 30, 90, 20, 80, 70];

//Array size
var arrElementWidth = 50;
var arrElementHeight = 50;

var width = $('#graphics').width(),
    height = $('#graphics').height();

var barChart = d3.select(".drawingArea")
    .append("svg:svg")
    .attr("width", width + 200)
    .attr("height", height + 200)
    .append('g')
        .attr("id", "barChart");

barChart.attr("transform", "translate(" + (width/2 - input.length/2 * (arrElementWidth + 5)) + ",10)");

var rectPositions = [];
var textPositions = [];
var elementPositions = [];

resetPosition();
createArray(input);

//Panning
var pan = d3.zoom()
    .on("zoom", panning);

barChart.call(pan);

var codeDisplayManager = new CodeDisplayManager('javascript', 'mergeSort');

function createArray(data) {
    barChart.selectAll("*").remove();
    input = data;
    createRects(data.length, 0);
    createTexts(data);
}

function resetPosition() {
    textPositions = [];
    rectPositions[0] = [];
    elementPositions = [];
    for(var i = 0; i < input.length; i++) {
        rectPositions[0][i] = [i * (arrElementWidth + 5) + (arrElementWidth+5)/2, 30];
        elementPositions[i] = 0;
        textPositions.push([i * (arrElementWidth + 5) + arrElementWidth / 2 + 5, 30]);
    }
}

function createRects(length, y) {
    for(var i = 0; i < length; i++) {
        createRect(i * (arrElementWidth + 5), y, 1);
    }
}

function createRect(x, y, opacity) {
    barChart.insert("rect", ":first-child")
        .attr("x", x)
        .attr("y", y)
        .attr("height", arrElementHeight)
        .attr("width", arrElementWidth)
        .attr("fill", "#F44336")
        .style("opacity", opacity)
        .attr("class", "level" + y/100)
        .attr("transform", "translate(0,0)");
}

function createTexts(data) {
    barChart.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", function (d, index) { return index * (arrElementWidth+5) + (arrElementWidth+5) / 2; })
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("width", arrElementWidth)
        .attr("transform", "translate(0,0)")
        .attr("class", function (d, i) { return "element" + i });
}

function panning() {
    barChart.attr("transform", d3.event.transform);
}

function sort() {
    $('#barChart').empty();
    resetPosition();
    createArray(input);
    codeDisplayManager.loadFunctions('mergeSort', 'merge');
    codeDisplayManager.changeFunction('mergeSort');
    var ms = new MergeSort(input.slice());
    ms.sort();
}

function split(from, to, direction, line) {
    var animations = [];

    for(var i = from; i <= to; i++) {
        var element = d3.select(".element" + i);
        var y = textPositions[i][1];
        y = y + 2*50;
        var delta;

        if(direction == "left") {
            delta = -50 / (y / 50);

        } else if(direction == "right") {
            delta = 50 / (y / 50);
        }

        textPositions[i][0] += delta;
        textPositions[i][1] += 2*50;

        elementPositions[i] += 1;

        if(rectPositions[elementPositions[i]] == undefined) rectPositions[elementPositions[i]] = [];
        rectPositions[elementPositions[i]][i] = [textPositions[i][0], textPositions[i][1]];

        createRect(textPositions[i][0] - arrElementWidth / 2, textPositions[i][1] - 30, 0);
        var movingElement = $("#barChart .element" + i);
        animations.push({ e: movingElement, p: { attr: {x: textPositions[i][0], y: textPositions[i][1]} }, o: { duration: 1, position: '-=1' } });

        movingElement.attr("class", ""); //Remove old classes
        movingElement.addClass("element" + i + " " + "level" + elementPositions[i]);

        animations.push({ e: $("#barChart .level" + ((textPositions[i][1]-30)/100)), p: { opacity: "1" }, o: { duration: 1, position: '-=1' } });
    }
    animations[0].o.position = '+=0';
    appendAnimation(line, animations, codeDisplayManager);
}

function merge(dest, from) {
    elementPositions[from] -= 1;
    var level = elementPositions[from];
    var position = rectPositions[level][dest];

    var movingElement = $(".element" + from + ".level" + (level+1));
    appendAnimation(null, [{ e: movingElement, p: { attr: {x:position[0], y: position[1] } }, o: { duration: 1 } }], null);

    movingElement.attr("class", ""); //Remove old classes
    movingElement.addClass("element" + dest + " " + "level" + level);
}

function highlightCode(lines, functionName) {
    if (functionName)
        codeDisplayManager.changeFunction(functionName);
    appendCodeLines(lines, codeDisplayManager);
}
