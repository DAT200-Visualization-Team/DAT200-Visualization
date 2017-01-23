/**
 * Created by Simen on 10.01.2017.
 */
var graphics = $("#graphics");
var code = $("#code");

//Test variabel
var array;
var arraylist;
//var array2;

//Create new array in gui - PH event

$( document ).ready(function() {
    graphics.empty();
    array = new GUIArray(5);
    array.createArray();
    arraylist = new ArrayList(array);
    //array2 = new GUIArray(5);
    //array2.createArray();
    $( "#draggable" ).draggable();
});

$(document).on("addToArray", {test: this},
    function(event, newVal) {
        array.addToArray(newVal);
    });

$(document).on("moveElement", {test: this},
    function(event, e_fromPos, e_toPos) {
        //Might be bad!
        array.moveElement(array, e_fromPos, e_toPos);
    });

$(document).on("replaceElement", {test: this},
    function(event, index, newVal) {
        array.replaceArrElement(index, newVal);
    });

function GUIArray(capacity) {
    this.canvas;
    this.guiElements = new Array(capacity);
    this.theSize;
    this.modCount;

    //Event test

}

GUIArray.prototype.createArray = function() {
    this.theSize = document.createElement("p");
    this.modCount = document.createElement("p");
    //Check if capacity is good enough. If it's not extend.
    this.canvas = document.createElement("div");
    this.canvas.className = "drawingArea";
    document.getElementById("graphics").appendChild(this.canvas);
    this.canvas.appendChild(this.theSize);
    this.canvas.appendChild(this.modCount);
    for(var i = 0; i < this.guiElements.length; i++) {
        var value = this.addGUICell(i);
        // Replace X with value from array code
        value.innerHTML = "X";
    }
    //Testing
    array = this;
};

GUIArray.prototype.addGUICell = function (pos) {
    this.guiElements[pos] = document.createElement("div");
    this.guiElements[pos].className = "element red lighten-3 z-depth-3";
    var value = document.createElement("p");
    value.className = "arrayVal noselect";
    this.guiElements[pos].appendChild(value);
    this.canvas.appendChild(this.guiElements[pos]);
    return value;
};


//Add element to gui array
GUIArray.prototype.addToArray = function (newValue) {
    if(this.guiElements.length == length) this.extendCapacity();
    //Ease in new value
    this.guiElements[length].firstChild.innerHTML = newValue;

    //Animation
    popInAnimation(this.guiElements[length].firstChild);
    length++;
};

//Replace element in gui array
GUIArray.prototype.replaceArrElement = function (pos, newValue) {
    if(array == "null") {
        throw new TypeError("Array does not exists");
    }
    //Check not out of bounds

    this.guiElements[pos].firstChild.innerHTML = newValue;

    //Ease in new value
    popInAnimation(this.guiElements[pos].firstChild);
};

GUIArray.prototype.moveElement = function(toArray, fromPos, toPos) {
    console.log("fromPos: " + fromPos + ", toPos: " + toPos);
    var copy = this.guiElements[fromPos].firstChild.cloneNode(true);
    this.canvas.appendChild(copy);
    //this.canvas.appendChild(copy);
    //Animate move to toElement
    copy.style.color = "red";
    var animation = moveAndReplaceAnimation(toArray.guiElements[fromPos], toArray.guiElements[toPos], copy);
    animation.onfinish = function() {
        toArray.guiElements[toPos].replaceChild(copy, toArray.guiElements[toPos].firstChild);
        copy.style.color = "black";
        copy.style.position = "static";
    };
};

GUIArray.prototype.extendCapacity = function () {
    var oldLength = this.guiElements.length;
    for(var i = oldLength; i < oldLength * 2 + 1; i++) {
        var cell = this.addGUICell(i);
        popInAnimation(cell.parentNode);
    }
};

GUIArray.prototype.updateTheSize = function (newVal) {
    this.theSize.innerHTML = newVal;
};

GUIArray.prototype.updateModCount = function (newVal) {
    this.modCount.innerHTML = newVal;
};

function popInAnimation(node) {
    var frames = [
        {opacity: 0.0, transform: "scale(0.5)"},
        {opacity: 1.0, transform: "scale(1.0)"},
        {opacity: 1.0, transform: "scale(1.5)"},
        {opacity: 1.0, transform: "scale(1.0)"}
    ];
    var timing = {
        duration: 500,
        direction: 'alternate',
        easing: 'ease-in-out'
    };
    node.animate(frames, timing);
}

function moveAndReplaceAnimation(fromNode, toNode, element) {
    var parent = fromNode.parentNode;
    var destinationX = toNode.offsetLeft - parent.offsetLeft;
    var destinationY = toNode.offsetTop - parent.offsetTop;
    var fromX = fromNode.offsetLeft - parent.offsetLeft;
    var fromY = fromNode.offsetTop - parent.offsetTop;
    var deltaX = destinationX - fromX;
    var deltaY = destinationY - fromY;
    var x = fromNode.offsetLeft + 13;
    var y = fromNode.offsetTop - 5;
    console.log("Delta X: " + deltaX);
    console.log("Delta Y: " + deltaY);
    element.style.position = "absolute";
    element.style.left = x + "px";
    element.style.top = y + "px";
    element.style.zIndex = "1000";
    var frames = [
        {transform: "translateX(" + 0 + "px) translateY(" + 0 + "px)"},
        {transform: "translateX(" + (deltaX/4) + "px) translateY(" + (deltaY-60) + "px)"},
        {transform: "translateX(" + ((2*deltaX)/4) + "px) translateY(" + (deltaY-80) + "px)"},
        {transform: "translateX(" + ((3*deltaX)/4) + "px) translateY(" + (deltaY-60) + "px)"},
        {transform: "translateX(" + deltaX + "px) translateY(" + deltaY + "px)"}
        ];
    var timing = {
        duration: 1000,
        direction: 'alternate',
        easing: 'ease-in-out'
    };
    var animation = element.animate(frames, timing);
    return animation
}

// Code animations
function highlightCode(line) {
    var frames = [
        {color: "black"},
        {color: "red"}
    ];
    var timing = {
        duration: 500,
        direction: 'alternate',
        easing: 'linear'
    };
    var animation = line.animate(frames, timing);
    line.style.color = "red";
    animation.onfinish = function() {
        setTimeout(function(){
            frames = [
                {color: "red"},
                {color: "black"}
            ];
            timing = {
                duration: 500,
                direction: 'alternate',
                easing: 'linear'
            };
            animation = line.animate(frames, timing);
            line.style.color = "black";
        }, 1000);
    };

    return animation
}

function displayAddCode() {
    //TODO parse JSON file and get current code from file
    var txt3 = document.createElement("p");
    txt3.innerHTML = "Code";
    document.getElementById("codeTextField").appendChild(txt3);
    highlightCode(txt3);
}
