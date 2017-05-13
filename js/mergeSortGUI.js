var input = [60, 30, 90, 20, 80, 70];

//Array size
var arrElementWidth = 50;
var arrElementHeight = 50;

var barWidth = 40;
var width = (arrElementWidth + 10) * input.length;
var height = 350;

var barChart = d3.select(".drawingArea")
    .append("svg:svg")
    .attr("width", width + 200)
    .attr("height", height + 200)
    .attr("id", "barChart");

var rectPositions = new BinaryTree(new BinaryNode([]));
var textPositions = [];

resetPosition();
createArray(input);

//Panning
var pan = d3.zoom()
    .on("zoom", panning);

barChart.call(pan);

var codeDisplayManager = new CodeDisplayManager('javascript', 'mergeSort');

function createArray(data) {
    createRects(data.length, 0);
    createTexts(data);
}

function resetPosition() {
    textPositions = [];
    for(var i = 0; i < input.length; i++) {
        rectPositions.root.element[i] = [i * (width / input.length) + 5, 0];
        textPositions.push([i * (width / input.length) + arrElementWidth / 2 + 5, 30]);
    }
}

function createRects(length, y) {
    for(var i = 0; i < length; i++) {
        createRect(i * (width / input.length) + 5, y, 1);
    }
}

function createRect(x, y, opacity) {
    barChart.insert("rect", ":first-child")
        .attr("x", x)
        .attr("y", y)
        .attr("height", arrElementHeight)
        .attr("width", arrElementWidth)
        .attr("fill", "red")
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
        .attr("x", function (d, index) { return index * (width / data.length) + arrElementWidth / 2 + 5; })
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

function split(from, to, direction) {
    console.log("from: " + from + ", to: " + to + ", direction: " + direction);
    var currentNode = rectPositions.root;
    if(direction == 'left') {
        while(currentNode.left != null) currentNode = currentNode.left;
        currentNode.left = new BinaryNode([]);
        currentNode = currentNode.left;
    } else {
        while(currentNode.right != null) currentNode = currentNode.right;
        currentNode.right = new BinaryNode([]);
        currentNode = currentNode.right;
    }

    var animations = [];

    for(var i = from; i <= to; i++) {
        var element = d3.select(".element" + i);
        var currentTranslation = getTranslate(element);
        var y = parseInt(currentTranslation[1]);
        y = y + 2*50;
        var delta;

        if(direction == "left") {
            delta = -50 / (y / 50);

        } else if(direction == "right") {
            delta = 50 / (y / 50);
        }

        textPositions[i][0] += delta;
        textPositions[i][1] += 2*50;
        currentNode.element.push([textPositions[i][0] - arrElementWidth / 2, textPositions[i][1] - 30]);

        createRect(textPositions[i][0] - arrElementWidth / 2, textPositions[i][1] - 30, 0);
        animations.push({ e: $("#barChart .element" + i), p: { x: '+=' + delta, y: '+=100' }, o: { duration: 1, position: '-=1' } });
        console.log("unhide level " + ((textPositions[i][1]-30)/100));
        animations.push({ e: $("#barChart .level" + ((textPositions[i][1]-30)/100)), p: { opacity: "1" }, o: { duration: 1, position: '-=1' } });
    }
    animations[0].o.position = '+=0';
    appendAnimation(null, animations, codeDisplayManager);
}

function merge(from, to) {
    
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

function highlightCode(lines, functionName) {
    if (functionName)
        codeDisplayManager.changeFunction(functionName);
    appendCodeLines(lines, codeDisplayManager);
}