var data = ["35", "33", "40"];

var barWidth = 40;
var width = (barWidth + 10) * data.length;
var height = 350;

//Array size
var arrElementWidth = 50;
var arrElementHeight = 50;

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
    .attr("opacity", "0")
    .text("theSize");

var mainArray = drawingArea.append("g")
    .attr("id", "mainArray");

createArray(getElements().length, 0, 0);

var arrayList = new ArrayList(data);

function createArray(length, oldlength, y) {

    width = (barWidth + 10) * length;

    drawingArea.attr("width", width + 150)
        .attr("height", height);

    for(var i = 0; i < length; i++) {
        mainArray.insert("svg:rect", ":first-child")
            .attr("x", i * ((width+20) / length) + 5 )
            .attr("y", 40)
            .attr("transform", "translate(0," + y + ")")
            .attr("height", arrElementHeight)
            .attr("width", arrElementWidth - 5)
            .attr("fill", "red")
            .attr("opacity", "0")
            .attr("class", "rect" + i );
    }

    for(var j = oldlength; j < length; j++) {
        mainArray.append("text")
            .text("")
            .attr("x",j * (width / length) + arrElementWidth / 3 + 5)
            .attr("y", 30+40)
            .attr("transform", "translate(0," + y + ")")
            .attr("width", barWidth)
            .attr("opacity", "0")
            .attr("class", "text" + j);
    }

    tl.to($("#mainArray").find("text, rect"), animationTime, {opacity:1});
}

function getElements() {
    var displayArr = [];
    for(var i = 0; i < capacity; i++) {
        if(data[i] == undefined) {
            displayArr[i] = "";
        } else {
            displayArr[i] = data[i];
        }
    }
    console.log(displayArr);
    return displayArr;
}

function add(index, textContent) {
    console.log("adding " + textContent + ", to index: " + index);
    var textbox = $(".text" + index);
    tl.to(textbox, animationTime, {text:{value:textContent}, ease:Linear.easeNone});
    //tl.to(textbox, animationTime, {opacity:1});
}

function move(from, size, capacity) {
    //TODO improve?
    var element = $(".text" + from);
    var oldElement = $(".text" + (from-1));

    if(from-1 >= 0) {
        tl.to(element, animationTime, {attr:{x:((from-1) * (width / capacity) + arrElementWidth / 3 + 5)}, ease:Linear.easeNone})
        .to(oldElement, animationTime, {text:"", ease:Linear.easeNone}, '-=' + animationTime);

        element.attr('class', "text" + (from-1));
    } else {
        tl.to(element, 0, {attr:{text:""}, ease:Linear.easeNone});
        element.attr('class', "text" + (capacity));
    }

    if(from-1 == capacity) {
        console.log("test");
        tl.to($(".text" + size), 0, {attr:{class:"text" + (size-2)}, ease:Linear.easeNone});
    }

}

function set(index, textContent) {
    var textbox = $(".text" + index);
    tl.to(textbox, animationTime, {text:{value:textContent}, ease:Linear.easeNone});
}

function extendCapacity(newCapacity, oldCapacity) {
    var oldArray = $("#mainArray").find("rect");
    createArray(newCapacity, oldCapacity, 100);

    var texts = $("#mainArray").find("text");
    tl.to(texts, animationTime, {attr:{transform:"translate(0,100)"}});

    tl.to(oldArray, animationTime, {opacity:0});
    //Remove old array?

    tl.to($("#mainArray").find("rect, text"), animationTime, {attr:{transform:"translate(0,0)"}});
}

function updateTheSize(newSize, length) {
    tl.to($("#theSizeBlock"), animationTime, {attr:{width:(newSize * ((width) / length) + 5)}});
    if(newSize >= 1) {
        tl.to($("#theSizeBlockText"), animationTime, {opacity:1});
    } else {
        tl.to($("#theSizeBlockText"), animationTime, {opacity:0});
    }
}

$( document ).ready(function() {
    //initCode();
});
