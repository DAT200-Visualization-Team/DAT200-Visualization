var data = ["35", "33", "40"];

//var barWidth = 40;

//Array size
var arrElementWidth = 50;
var arrElementHeight = 50;

var width = (arrElementWidth + 10) * data.length;
var height = 350;

//Animation
var animationTime = 0.5;
var tl = new TimelineMax();
tl.pause();

//var arrayList = new ArrayList(data);
var theSize = 3;
var capacity = 5;

//PH - Code TODO get code from another source
var codeContent = [
    "",
    "function Arraylist(a) {",
    "    for(var gap = a.length / 2; gap > 0;",
    "        gap = gap === 2 ? 1 : parseInt(gap / 2.2)) {",
    "",
    "        for(var i = gap; i < a.length; i++) {",
    "            var tmp = a[i];",
    "",
    "            for(var j = i; j >= gap && tmp < a[j - gap]; j-= gap) {",
    "                a[j] = a[j - gap];",
    "            }",
    "            a[j] = tmp;",
    "        }",
    "    }",
    "    return a;",
    "}"
];

var code = d3.select("#code-text");
var drawingArea = d3.select(".drawingArea").append("svg:svg");
var theSizeBlock = drawingArea.append("g");

theSizeBlock.append("rect")
    .attr("width", 0)
    .attr("height", (arrElementHeight + 40 + 10))
    .attr("id", "theSizeBlock")
    .attr("fill", "lime");

theSizeBlock.append("text")
    .attr("y", 25)
    .attr("x", 10)
    .attr("id", "theSizeBlockText")
    .style("opacity", "0")
    .text("theSize");

var mainArray = drawingArea.append("g")
    .attr("id", "mainArray");

createArray(5, 0, 0);

var arrayList = new ArrayList(data);

function createArray(length, oldlength, y) {

    width = (arrElementWidth + 10) * length;

    drawingArea.attr("width", width + 150)
        .attr("height", height);

    for(var i = 0; i < length; i++) {
        mainArray.insert("svg:rect", ":first-child")
            .attr("x", i * ((width) / length) + 5 )
            .attr("y", 40)
            .attr("transform", "translate(0," + y + ")")
            .attr("height", arrElementHeight)
            .attr("width", arrElementWidth)
            .attr("fill", "red")
            .style("opacity", "0")
            .attr("class", "rect" + i );
    }

    for(var j = oldlength; j < length; j++) {
        createTextElement(j, length, y, "");
/*        mainArray.append("text")
            .text("")
            .attr("x",j * (width / length) + arrElementWidth / 3 + 5)
            .attr("y", 30+40)
            .attr("transform", "translate(0," + y + ")")
            .attr("width", barWidth)
            .attr("opacity", "0")
            .attr("class", "text" + j);*/
    }

    tl.to($("#mainArray").find("rect"), animationTime, {opacity:1});
}

function createTextElement(elementNr, length, startY, startValue) {
    mainArray.append("text")
        .text(startValue)
        .attr("x",elementNr * (width / length) + arrElementWidth / 2 + 5)
        .attr("y", 30+40)
        .attr("transform", "translate(0," + startY + ")")
        .attr("width", arrElementWidth)
        .attr("text-anchor", "middle")
        .style("opacity", "0")
        .attr("class", "text" + elementNr);
}

function add(index, textContent) {
    console.log("adding " + textContent + ", to index: " + index);
    var textbox = $(".text" + index);
    if(textbox.length == 0) {
        createTextElement(index, arrayList.capacity, 0, "");
        textbox = $(".text" + index);
    }
    tl.to(textbox, animationTime, {text:{value:textContent}, opacity:1, ease:Linear.easeNone});
}

function move(from, capacity, NewTextNeeded) {
    //if(NewTextNeeded) createTextElement(from, arrayList.capacity, 0, "");
    console.log("Move" + from);
    console.log(NewTextNeeded);
    var element = $(".text" + from);
    var oldElement = $(".text" + (from-1));

        tl.to(element, animationTime, {attr:{x:((from-1) * (width / capacity) + arrElementWidth / 2 + 5)}, ease:Linear.easeNone})
        .to(oldElement, animationTime, {opacity:"0", ease:Linear.easeNone}, '-=' + animationTime);

        oldElement.attr('class', "");
        element.attr('class', "text" + (from-1));
}

function set(index, textContent) {
    var textbox = $(".text" + index);
    tl.to(textbox, animationTime, {text:{value:textContent}, ease:Linear.easeNone});
}

function extendCapacity(newCapacity, oldCapacity) {
    var oldArray = $("#mainArray rect");
    createArray(newCapacity, oldCapacity, 100);

    //for(var j = 0; j < oldCapacity; j++) {
    //    createTextElement(j, oldCapacity, 0, arrayList.theItems[j]);
    //}

    //var texts = $("#mainArray").find("text");

    for(var i = 0; i < oldCapacity; i++) {
        //$(".text" + i).css("opacity", "1");
        tl.to($(".text" + i), animationTime, {y:100});
    }

    tl.to(oldArray, animationTime, {opacity:0});

    tl.to($("#mainArray").find("rect, text"), animationTime, {y:0});
}

function updateTheSize(newSize, length) {
    tl.to($("#theSizeBlock"), animationTime, {attr:{width:(newSize * (width / length) + 1.25)}});
    if(newSize >= 1) {
        tl.to($("#theSizeBlockText"), animationTime, {opacity:1});
    } else {
        tl.to($("#theSizeBlockText"), animationTime, {opacity:0});
    }
}

$( document ).ready(function() {
    //initCode();
});
