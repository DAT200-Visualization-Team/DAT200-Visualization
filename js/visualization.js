/**
 * Created by Simen on 10.01.2017.
 */
var graphics = $("#graphics");

//Test variabel
var array;
//var array2;

//Create new array in gui - PH event
graphics.click(function() {
    graphics.empty();
    array = new GUIArray(5);
    array.createArray();
    //array2 = new GUIArray(5);
    //array2.createArray();

});

function GUIArray(capacity) {
    this.canvas;
    this.guiElements = new Array(capacity);
    this.length = 0;
}

GUIArray.prototype.createArray = function() {
    //Check if capacity is good enough. If it's not extend.
    this.canvas = document.createElement("div");
    this.canvas.className = "drawingArea";
    document.getElementById("graphics").appendChild(this.canvas);
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
    var copy = this.guiElements[fromPos].firstChild.cloneNode(true);
    this.guiElements[fromPos].appendChild(copy);
    //this.canvas.appendChild(copy);
    //Animate move to toElement
    copy.style.color = "red";
    var animation = moveAndReplaceAnimation(toArray.guiElements[fromPos].firstChild, toArray.guiElements[toPos].firstChild, copy);
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
    //console.log("Destination: " + destinationX + ", " + destinationY);
    //console.log("source: " + fromX + ", " + fromY);
    //var deltaX = destinationX - fromX;
    var deltaX = 100;
    var deltaY = 0;
    //var deltaY = destinationY - fromY;
    element.style.position = "absolute";
    element.style.left = fromNode.offsetLeft + "px";
    element.style.top = fromNode.offsetTop + "px";
    element.style.zIndex = "1000";
    var frames = [
        {transform: "translateX(" + 0 + "px) translateY(" + 0 + "px)"},
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
