var linkedList = new LinkedList();
var offsetX = 50;
var offsetY = 100;
var nodeHeight = 60;
var nodeWidth = 40;
var nodeSpace = 90;
var speed = 1;
var animationTime = 1000 * speed;

$('#download-button, #download-button-mobile').on('click', function () {
    var arrayRepresentation = linkedList.toArray();
    arrayRepresentation.unshift(linkedList.theSize, linkedList.modCount);
    downloadObjectJson(arrayRepresentation, 'LinkedList');
});

function clear() {
    $('svg').empty();
    updateDrawingArea();
}

function createNode(xPos, yPos, data, id, idx, prevIsShort, nextIsShort) {
    var n = $('<g></g>');
    n.attr("id", id);
    var nData = $('<g></g>');
    var prevLength;
    var nextLength;

    prevIsShort ? prevLength = nodeSpace/2 : prevLength = nodeSpace;
    nextIsShort ? nextLength = nodeSpace/2 : nextLength = nodeSpace;

    nData
        .addClass("data")
        .append('<rect x="' + xPos + '" y="' + yPos + '" width="' + nodeWidth + '" height="' + nodeHeight + '"></rect>')
        .append('<text x="' + (xPos+nodeWidth/2) + '" y="' + (yPos+nodeHeight/2) + '" alignment-baseline="middle" text-anchor="middle" font-size="24" fill="black">' + data + '</text>');
    var nNext = createArrow("n", (xPos+nodeWidth), (yPos+15), nextLength, 0);
    var nPrev = createArrow("p", xPos, (yPos+45), prevLength, 0);
    n
        .append(nData)
        .append(nNext)
        .append(nPrev)
        .attr("class", "node");

    if(idx == null || idx === -1) {

        $("#linkedlist").append(n);
        n = $("#linkedlist:last-child")
        return n;

    }

    n.insertBefore($("#linkedlist").children().eq(idx));
    n = $("#linkedlist").children().eq(idx);
    return n;
}

function createArrow(type, x0, y0, dx, dy) {
    var arrow = $("<g></g>");
    var className = "";
    (type === 'n') ? className = 'nextArrow' : className = 'prevArrow';
    arrow.addClass(className);
    if (type === "n") {
        var x1 = x0 + dx;
        var y1 = y0 + dy;
        var offset = -3;

        var p1 = 'M ' + (x1-5) + ' ' + (y1-5) + ' ';
        var p2 = 'L ' + (x1-5) + ' ' + (y1+5) + ' ';
        var p3 = 'L ' + (x1) + ' ' + (y1) + ' ';
    }
    else if(type === "p") {
        var x1 = x0 - dx;
        var y1 = y0 - dy;
        var offset = 3;

        var p1 = 'M ' + (x1+5) + ' ' + (y1+5) + ' ';
        var p2 = 'L ' + (x1+5) + ' ' + (y1-5) + ' ';
        var p3 = 'L ' + (x1) + ' ' + (y1) + ' ';
    }
    else {
        throw new Error('"' + type + '" is not a type of arrow');
    }
    var mx = x0;
    var my = y0;

    var curve = '<path d="M ' + x0 + ' ' + y0 + ' Q ' + mx + ' ' + my + ' ' + (x1+offset) + ' ' + y1 + '" class="' + className + 'Line" />';
    var triangle = '<path d="' + p1 + p2 + p3 + 'Z" class="' + className + 'Head" />';
    arrow.append(curve);
    arrow.append(triangle);
    return arrow;
}

function createPointer(direction, x0, y0, x1, y1) {
    var pointer = $("<g></g>");
    pointer.addClass("pointer");
    var curve = '<path d="M ' + x0 + ' ' + y0 + ' L ' + x1 + ' ' + y1 + '" class="pointerLine" />';
    switch (direction) {
        case 'north':
            var p1 = 'M ' + (x1 - 5) + ' ' + (y1) + ' ';
            var p2 = 'L ' + (x1 + 5) + ' ' + (y1) + ' ';
            var p3 = 'L ' + (x1) + ' ' + (y1 - 5) + ' ';
            break;
        case 'south':
            var p1 = 'M ' + (x1 + 5) + ' ' + (y1) + ' ';
            var p2 = 'L ' + (x1 - 5) + ' ' + (y1) + ' ';
            var p3 = 'L ' + (x1) + ' ' + (y1 + 5) + ' ';
            break;
        case 'west':
            var p1 = 'M ' + (x1) + ' ' + (y1 + 5) + ' ';
            var p2 = 'L ' + (x1) + ' ' + (y1 - 5) + ' ';
            var p3 = 'L ' + (x1 - 5) + ' ' + (y1) + ' ';
            break;
        case 'east':
            var p1 = 'M ' + (x1) + ' ' + (y1 - 5) + ' ';
            var p2 = 'L ' + (x1) + ' ' + (y1 + 5) + ' ';
            var p3 = 'L ' + (x1 + 5) + ' ' + (y1) + ' ';
            break;
        default:
            throw new Error("Direction is invalid");
    }
    var triangle = '<path d="' + p1 + p2 + p3 + 'Z" class="pointerHead" />';
    pointer.append(curve);
    pointer.append(triangle);
    $("#linkedlist").append(pointer);
    pointer = $("#linkedlist:last-child");
    return pointer;
}

function updateDrawingArea() {
    $(".drawingArea").html($(".drawingArea").html());
}

function redraw() {
    clear();
    var pos = offsetX + nodeWidth + nodeSpace;
    createNode(offsetX, offsetY, 'H', 'Head', -1, true, false);

    var it = linkedList.iterator(1);
    while(it.hasNext()) {
        var data = it.next();
        if(!it.hasNext()) {
            break;
        }
        createNode(pos, offsetY, data);
        pos += (nodeWidth + nodeSpace);
    }
    createNode(pos, offsetY, 'T', 'Tail', -1, false, true);
    updateDrawingArea();
}

//TODO: implement and include "highlightNextLine"
function initialize() {
    clear();
    linkedList = new LinkedList();

    linkedList.addLast('H');
    linkedList.addLast('T');

    createNode(offsetX, offsetY, 'H', 'Head', -1, true, true);
    createNode(offsetX + nodeSpace + nodeWidth, offsetY, 'T', 'Tail', -1, true, true);
    updateDrawingArea();

    var head = $("#linkedlist").children().first();
    var tail = $("#linkedlist").children().last();
    tail.attr("opacity", "0");

    head.velocity("transition.expandIn", {
            duration: animationTime,
            complete: function() {
                tail.attr("opacity", "1");
                tail.velocity("transition.expandIn", {
                        duration: animationTime,
                        complete: function() {
                            setTimeout(function() {
                                aniMoveArrow(0, 'next', 45, 0);
                                setTimeout(function() {
                                    redraw();
                                }, animationTime);
                            }, animationTime);
                            aniMoveArrow(1, 'prev', -45, 0);
                        }
                    }
                )
            }
        }
    );
}

function addByIndex(idx, data) {
    if (linkedList.size() === 0) {
        throw new Error("Linked List has not yet been initialized");
    }
    else if(idx < 0 || idx >= linkedList.size() - 1) {
        throw new Error("Index is out of range");
    }

    linkedList.add(idx + 1, data);

    // Get and draw p
    var p = createPointer('south',
        (offsetX + nodeWidth/2 + ((nodeWidth + nodeSpace) * (idx+1))),
        50,
        (offsetX + nodeWidth/2 + ((nodeWidth + nodeSpace) * (idx+1))),
        80);


    // Draw newNode with both arrows
    var node = createNode((offsetX + ((idx+1) * (nodeWidth + nodeSpace))),
        offsetY+nodeHeight, data, true, (idx + 1));
    updateDrawingArea();

    var node = $("#linkedlist").children().eq(idx+1);
    node.attr("opacity", "0");

    //taking first the head in mind, and then the tail
    var i = idx + 2;
    var elementsToBeMoved;
    for(; i < linkedList.size() + 1; i++) {
        i === idx + 2 ? elementsToBeMoved = $("#linkedlist").children().eq(i)
            : elementsToBeMoved = elementsToBeMoved.add($("#linkedlist").children().eq(i));
    }

    p = $("#linkedlist").children().last();
    p.velocity(
        "transition.expandIn", {
            duration: animationTime,
            complete: function() {

                //Fading in the new node while old nodes make place
                aniMoveArrow(idx, 'next', nodeSpace+nodeWidth, 0);
                aniMoveArrow(idx+2, 'prev', -(nodeSpace+nodeWidth), 0);
                elementsToBeMoved.velocity(
                    { translateX: "+" + (nodeWidth+nodeSpace), translateY: "+=0" },
                    {duration: animationTime}
                );
                aniMoveArrow(idx+1, 'prev', 0, -(45+5));
                aniMoveArrow(idx+1, 'next', 0, -(15+55));


                node.attr("opacity", "1");
                node.velocity("transition.expandIn", {
                    duration: animationTime, easing: "easeInOutExpo",
                    complete: function() {

                        // Draw newNode.prev.next to newNode
                        aniMoveArrow(idx, 'next', -(nodeSpace+nodeWidth), 45+15);

                        // Draw p.prev to newNode
                        setTimeout(function() {
                            aniMoveArrow(idx+2, 'prev', (nodeSpace+nodeWidth), 15+45);

                            // Redraw to clean up the mess
                            setTimeout(function() {
                                node.velocity({
                                    translateY: "" + (-nodeHeight)}, {
                                    duration: animationTime
                                });

                                aniMoveArrow(idx+1, 'prev', 0, 45+5);
                                aniMoveArrow(idx+1, 'next', 0, 15+55);
                                aniMoveArrow(idx, 'next', 0, -(45+15));
                                aniMoveArrow(idx+2, 'prev', 0, -(15+45));

                                setTimeout(function() {
                                    redraw();
                                }, animationTime);
                            }, animationTime);
                        }, animationTime);
                    }
                });
            }
        }
    );
}

//TODO: find a meaningful variable to take in
function removeNode(idx) {
    if (linkedList.size() === 0) {
        throw new Error("Linked List has not yet been initialized");
    }
    else if(idx < 0 || idx >= linkedList.size() - 2) {
        throw new Error("Index is out of range");
    }

    idx = idx + 1; //'cause u can't remove the head
    linkedList.removeByIdx(idx);

    //p.next.prev = p.prev;
    aniMoveCurvedArrow(idx+1, 'prev', -(nodeWidth+nodeSpace), 0, 60);

    //p.prev.next = p.next;
    setTimeout(function() {
        aniMoveCurvedArrow(idx-1, 'next', (nodeWidth+nodeSpace), 0, -60);

        //Clean up the mess and redraw
        setTimeout(function() {
            var p = $("#linkedlist").children().eq(idx);
            p.velocity(
                "fadeOut", {duration: animationTime}
            );

            aniMoveCurvedArrow(idx + 1, 'prev', (nodeWidth+nodeSpace), 0, -60);
            aniMoveCurvedArrow(idx - 1, 'next', -(nodeWidth+nodeSpace), 0, 60);

            var i = idx + 1;
            var elementsToBeMoved;
            for(; i < linkedList.size() + 1; i++) {
                i === idx + 1 ? elementsToBeMoved = $("#linkedlist").children().eq(i)
                    : elementsToBeMoved = elementsToBeMoved.add($("#linkedlist").children().eq(i));
            }
            elementsToBeMoved.velocity(
                { translateX: "-" + (nodeWidth+nodeSpace), translateY: "+=0" },
                {duration: animationTime}
            );

            setTimeout(function() {
                redraw();
            }, animationTime);
        }, animationTime);
    }, animationTime);
}

//TODO: finish this
//FIXME: the arrow won't move
function getNode(idx) {
    var p = createPointer('south', offsetX+nodeWidth/2, 50, offsetX+nodeWidth/2, 80);
    p = $("#linkedlist").children().last();
    updateDrawingArea();
    if (idx < linkedList.size() / 2) {
        for(var i = 0; i < linkedList.size(); i++) {
            p.velocity(
                { translateX: "+" + (nodeWidth+nodeSpace), translateY: "+=0" },
                {duration: animationTime}
            );
        }
    }
}

function findPos(data) {
    var p = createPointer('south',
        offsetX + nodeSpace + nodeWidth / 2, 50,
        offsetX + nodeSpace + nodeWidth / 2, 80);

    for (var i = 0; i < linkedList.size(); i++) {
        p.velocity(
            { translateX: "+" + (nodeWidth+nodeSpace), translateY: "+=0" },
            {duration: animationTime}
        );
    }


    /*for (var p = this.head.next; p !== this.tail; p = p.next) {
        if (x === null) {
            if (p.data === null) {
                return p;
            }
        }
        else if (x === p.data) { //must really use x.equals(p.data)
            return p;
        }
    }*/
}





/***
 * ANIMATIONS
 */
function aniMoveArrow(nodeIdx, arrowType, dx, dy) {
    var node = $("#linkedlist").children().eq(nodeIdx);
    var arrow;
    (arrowType === 'next') ? (arrow = node.children().eq(1)) : (arrow = node.children().eq(2));

    var arch = arrow.children().first().attr("d");
    arch = arch.split(' ');
    var x0 = parseInt(arch[1]);
    var y0 = parseInt(arch[2]);
    var x1 = parseInt(arch[6]);
    var y1 = parseInt(arch[7]);

    var triangle = arrow.children().last().attr("d");
    triangle = triangle.split(' ');
    var p0x = parseInt(triangle[1]);
    var p0y = parseInt(triangle[2]);
    var p1x = parseInt(triangle[4]);
    var p1y = parseInt(triangle[5]);
    var p2x = parseInt(triangle[7]);
    var p2y = parseInt(triangle[8]);

    //TODO: make the prev of Tail move as soon as Tail is faded in
    arrow.children().velocity(
        {tween: 1},
        {duration: animationTime,
            progress: function(elements, complete, remaining, start, tweenValue) {
                elements[0].setAttribute(
                    "d", "M " + x0 + " " + y0 + " Q " + x0 + " " + y0 + " " + ((tweenValue * dx) + x1) + " " + ((tweenValue * dy) + y1)
                );
                elements[1].setAttribute(
                    "d", "M " + (p0x + (dx * tweenValue)) + " " + (p0y + (dy * tweenValue)) + " L " + (p1x + (dx * tweenValue)) + " " + (p1y + (dy * tweenValue)) + " L " + (p2x + (dx * tweenValue)) + " " + (p2y + (dy * tweenValue) + " Z")
                );

            }
        }
    );
}

function aniMoveCurvedArrow(nodeIdx, arrowType, dx, dy, my1) {
    var node = $("#linkedlist").children().eq(nodeIdx);
    var arrow;
    (arrowType === 'next') ? (arrow = node.children().eq(1)) : (arrow = node.children().eq(2));

    var arch = arrow.children().first().attr("d");
    arch = arch.split(' ');
    var x0 = parseInt(arch[1]);
    var y0 = parseInt(arch[2]);
    var x1 = parseInt(arch[6]);
    var y1 = parseInt(arch[7]);
    var mx = (x0 + x1 + dx)/2;
    var my0 = parseInt(arch[5]);

    var triangle = arrow.children().last().attr("d");
    triangle = triangle.split(' ');
    var p0x = parseInt(triangle[1]);
    var p0y = parseInt(triangle[2]);
    var p1x = parseInt(triangle[4]);
    var p1y = parseInt(triangle[5]);
    var p2x = parseInt(triangle[7]);
    var p2y = parseInt(triangle[8]);

    //TODO: make the prev of Tail move as soon as Tail is faded in
    arrow.children().velocity(
        {tween: 1},
        {duration: animationTime,
            progress: function(elements, complete, remaining, start, tweenValue) {
                elements[0].setAttribute(
                    "d", "M " + x0 + " " + y0 + " Q " + mx + " " + ((tweenValue * my1) +my0)  + " " + ((tweenValue * dx) + x1) + " " + ((tweenValue * dy) + y1)
                );
                elements[1].setAttribute(
                    "d", "M " + (p0x + (dx * tweenValue)) + " " + (p0y + (dy * tweenValue)) + " L " + (p1x + (dx * tweenValue)) + " " + (p1y + (dy * tweenValue)) + " L " + (p2x + (dx * tweenValue)) + " " + (p2y + (dy * tweenValue) + " Z")
                );

            }
        }
    );
}


/**
 * Some helpers while developing - Delete when all animations are done
**/

function initializeAndAdd(howMany) {
    speed = 0.001;
    animationTime = 1000*speed;
    initialize();
    for (var i = 0; i <= howMany; i++) {
        addByIndex(i, i);
    }
    speed = 1;
    animationTime = 1000*speed;
}