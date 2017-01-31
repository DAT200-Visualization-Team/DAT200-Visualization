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
    $("#draggable").draggable();
    $('#download-button').click(downloadCurrentArrayList);
    $('#download-button-mobile').click(downloadCurrentArrayList);
});

$(document).on("extendCapacity", {test: this},
    function(event, pos) {
            console.log("array.guiElements.length " + pos + ", array.capacity " + array.capacity);
            if(pos == array.capacity) array.extendCapacity();
            //setTimeout(function(){
            //    array.replaceArrElement(pos, newVal);
            //}, 1000);
    });

$(document).on("moveElement", {test: this},
    function(event, e_fromPos, e_toPos) {
        //Might be bad!
        array.moveElement(array.guiElements, e_fromPos, e_toPos);
    });

$(document).on("replaceElement", {test: this},
    function(event, index, newVal) {
        array.replaceArrElement(index, newVal);
    });

$(document).on("updateTheSize", {test: this},
    function(event, newVal) {
        array.updateTheSize(newVal);
    });

$(document).on("updateModCount", {test: this},
    function(event, newVal) {
        array.updateModCount(newVal);
    });

function GUIArray(capacity) {
    this.canvas;
    this.capacity = capacity;
    this.guiElements = new Array(capacity);
    this.theSize;
    this.modCount;
}

GUIArray.prototype.createArray = function() {
    this.theSize = document.createElement("p");
    this.modCount = document.createElement("p");
    //Check if capacity is good enough. If it's not extend.
    this.canvas = document.createElement("div");
    this.canvas.className = "drawingArea";
    document.getElementById("graphics").appendChild(this.theSize);
    document.getElementById("graphics").appendChild(this.modCount);
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

//Replace element in gui array
GUIArray.prototype.replaceArrElement = function (pos, newValue) {
    if(array == "null") {
        throw new TypeError("Array does not exists");
    }
    //Check not out of bounds

    console.log("Replaced element nr: " + pos);
    this.guiElements[pos].firstChild.innerHTML = newValue;

    //Ease in new value
    popInAnimation(this.guiElements[pos].firstChild);
};

GUIArray.prototype.moveElement = function(toArray, fromPos, toPos) {
    console.log("fromPos: " + fromPos + ", toPos: " + toPos);
    console.log("toArray element: " + toArray[toPos]);
    var copy = this.guiElements[fromPos].firstChild.cloneNode(true);
    this.canvas.appendChild(copy);
    //Animate move to toElement
    copy.style.color = "red";
    var animation = moveAndReplaceAnimation(this.guiElements[fromPos], toArray[toPos], copy, 13, -5);
    animation.onfinish = function() {
        toArray[toPos].replaceChild(copy, toArray[toPos].firstChild);
        copy.style.color = "black";
        copy.style.position = "static";
    };
    return animation;
};

GUIArray.prototype.extendCapacity = function () {
    var old = this.guiElements;

    var newDiv = document.createElement("div");
    newDiv.className = "drawingArea";
    document.getElementById("graphics").appendChild(newDiv);
    var newArray = new Array(old.length * 2 + 1);
    for (var i = 0; i < newArray.length; i++) {
        //var value = this.addGUICell(i);
        newArray[i] = document.createElement("div");
        newArray[i].className = "element red lighten-3 z-depth-3";
        var value = document.createElement("p");
        value.className = "arrayVal noselect";
        newArray[i].appendChild(value);
        newDiv.appendChild(newArray[i]);
        value.innerHTML = "X";
    }



    //Save animation so that add/replace can wait for it
    var animation = replaceArray(this, newArray, 0);

    //Remove old arrays
    //setTimeout(function(){
    //   moveAndReplaceAnimation(newDiv, oldArray, newDiv, 0, 0);
    //}, 1200);

    setTimeout(function(){
        console.log("Changed array");
        //var oldArray = this.canvas;
        this.canvas = newDiv;
        //this.guiElements = newArray;

        graphics.find('div').first().remove();
    }, 19000);

    return animation;
};

function downloadCurrentArrayList() {
    downloadObjectJson(arraylist);
}

function replaceArray (fromArray, toArray, pos) {
    var animation;
    //console.log("outside: " + pos);
    setTimeout(function () {
        //console.log("array pos: " + pos + ", and toarray size" + fromArray.theSize);
        animation = fromArray.moveElement(toArray, pos, pos);
        //animation = this.moveAndReplaceAnimation(testtemp.guiElements[j].firstChild, newArray[j].firstChild, 0, 0);
        if(pos + 1 == fromArray.guiElements.length) {
            return animation;
        } else {
            //console.log("guiElements set" + ", old size is: " + this.guiElements.length);
            this.guiElements = toArray;
            //console.log("guiElements set" + ", new size is: " + this.guiElements.length);
            return replaceArray(fromArray, toArray, pos+1);
        }
    }, 250);
}

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

function moveAndReplaceAnimation(fromNode, toNode, element, elementOffsetX, elementOffsetY) {
    var parent = fromNode.parentNode;
    var destinationX = toNode.offsetLeft - parent.offsetLeft;
    var destinationY = toNode.offsetTop - parent.offsetTop;
    var fromX = fromNode.offsetLeft - parent.offsetLeft;
    var fromY = fromNode.offsetTop - parent.offsetTop;
    var deltaX = destinationX - fromX;
    var deltaY;
    //TODO crazy!
    if(destinationY < 0) {
        deltaY = -(destinationY - fromY);
    } else {
        console.log("crazy");
        deltaY = destinationY - fromY;
    }
    //var deltaY = -(destinationY - fromY);
    //var x = fromNode.offsetLeft + 13;
    //var y = fromNode.offsetTop - 5;
    var x = fromNode.offsetLeft + elementOffsetX;
    var y = fromNode.offsetTop + elementOffsetY;
    console.log("XFrom :" + fromX + ", YFrom: " + fromY);
    console.log("XDestination :" + destinationX + ", YDestination: " + destinationY);
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
