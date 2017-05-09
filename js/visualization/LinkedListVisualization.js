var linkedList = new LinkedList();
var offsetX = 50;
var offsetY = 100;
var nodeHeight = 60;
var nodeWidth = 40;
var nodeSpace = 90;
var animationTime = 1;
var codeDisplayManager;


// (non-animation) initializer, adds some nodes
function fastInitialize(n) {
    console.log(n);
    codeDisplayManager = new CodeDisplayManager("javascript", "linkedlist");
    linkedList.addFirst("H");
    if(n.length != 0) {
        for(var i = 0; i < n.length; i++) {
            linkedList.addLast(n[i]);
        }
    }
    else {
        linkedList.addLast("x");
        linkedList.addLast("y");
        linkedList.addLast("z");
    }
    linkedList.addLast("T");
    redraw();
}

$('#download-button, #download-button-mobile').on('click', function () {
    var arrayRepresentation = linkedList.toArray();
    arrayRepresentation.unshift(linkedList.theSize, linkedList.modCount);
    downloadObjectJson(arrayRepresentation, 'LinkedList');
});

function processUploadedObject(object) {
    var arrayRepresentation = object.LinkedList;
    clear();
    linkedList = new LinkedList();

    var pos = offsetX;
    createNode(pos, offsetY, arrayRepresentation[i], 'Head', -1, true, false);

    for (var i = 3; i < arrayRepresentation.length - 1; i++, pos += nodeWidth + nodeSpace) {
        linkedList.addLast(arrayRepresentation[i]);
        createNode(pos, offsetY, arrayRepresentation[i]);
    }
    createNode(pos, offsetY, arrayRepresentation[i], 'Tail', -1, false, true);
    linkedList.theSize = arrayRepresentation[0];
    linkedList.modCount = arrayRepresentation[1];
    updateDrawingArea();
}

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

    prevIsShort ? prevLength = nodeSpace / 2 : prevLength = nodeSpace;
    nextIsShort ? nextLength = nodeSpace / 2 : nextLength = nodeSpace;

    nData
        .addClass("data")
        .append('<rect x="' + xPos + '" y="' + yPos + '" width="' + nodeWidth + '" height="' + nodeHeight + '"></rect>')
        .append('<text x="' + (xPos + nodeWidth / 2) + '" y="' + (yPos + nodeHeight / 2) + '" alignment-baseline="middle" text-anchor="middle" font-size="24" fill="black">' + data + '</text>');
    var nNext = createArrow("n", (xPos + nodeWidth), (yPos + 15), nextLength, 0);
    var nPrev = createArrow("p", xPos, (yPos + 45), prevLength, 0);
    n
        .append(nData)
        .append(nNext)
        .append(nPrev)
        .attr("class", "node");

    if (idx == null || idx === -1) {

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

        var p1 = 'M ' + (x1 - 5) + ' ' + (y1 - 5) + ' ';
        var p2 = 'L ' + (x1 - 5) + ' ' + (y1 + 5) + ' ';
        var p3 = 'L ' + (x1) + ' ' + (y1) + ' ';
    }
    else if (type === "p") {
        var x1 = x0 - dx;
        var y1 = y0 - dy;
        var offset = 3;

        var p1 = 'M ' + (x1 + 5) + ' ' + (y1 + 5) + ' ';
        var p2 = 'L ' + (x1 + 5) + ' ' + (y1 - 5) + ' ';
        var p3 = 'L ' + (x1) + ' ' + (y1) + ' ';
    }
    else {
        throw new Error('"' + type + '" is not a type of arrow');
    }
    var mx = x0;
    var my = y0;

    var curve = '<path d="M ' + x0 + ' ' + y0 + ' Q ' + mx + ' ' + my + ' ' + (x1 + offset) + ' ' + y1 + '" class="' + className + 'Line" />';
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
    while (it.hasNext()) {
        var data = it.next();
        if (!it.hasNext()) {
            break;
        }
        createNode(pos, offsetY, data);
        pos += (nodeWidth + nodeSpace);
    }
    createNode(pos, offsetY, 'T', 'Tail', -1, false, true);
    updateDrawingArea();
}

//STATUS: converted to GSAP
function initialize() {
    clear();
    linkedList = new LinkedList();
    codeDisplayManager = new CodeDisplayManager("javascript", "linkedlist");
    codeDisplayManager.loadFunctions("constructor");
    codeDisplayManager.changeFunction("constructor");

    linkedList.addLast('H');
    linkedList.addLast('T');

    createNode(offsetX, offsetY, 'H', 'Head', -1, true, true);
    createNode(offsetX + nodeSpace + nodeWidth, offsetY, 'T', 'Tail', -1, true, true);
    updateDrawingArea();

    var head = $("#linkedlist").children().first();
    var tail = $("#linkedlist").children().last();
    head.attr("opacity", "0");
    tail.attr("opacity", "0");

    var hArrow = head.children().eq(1);
    var tArrow = tail.children().eq(2);

    appendAnimation(0, [{ e: head, p: {opacity: 1}, o: { duration: animationTime }}], codeDisplayManager);

    var tmp = [
        { e: tail, p: {opacity: 1}, o: { duration: animationTime } },
        GSAPArrowAnimate(tArrow, -45, 0)[0],
        GSAPArrowAnimate(tArrow, -45, 0)[1]
    ];
    appendAnimation(1, tmp, codeDisplayManager);

    appendAnimation(2, GSAPArrowAnimate(hArrow, 45, 0), codeDisplayManager);

    appendCodeLines([3, 4], codeDisplayManager);
}



function NEWaddByIndex(idx, data) {
    if (linkedList.size() === 0) {
        throw new Error("Linked List has not yet been initialized");
    }
    else if (idx < 0 || idx >= linkedList.size() - 1) {
        throw new Error("Index is out of range");
    }

    linkedList.add(idx + 1, data);

    // Get and draw p
    var p = createPointer('south',
        (offsetX + nodeWidth / 2 + ((nodeWidth + nodeSpace) * (idx + 1))),
        50,
        (offsetX + nodeWidth / 2 + ((nodeWidth + nodeSpace) * (idx + 1))),
        80);


    // Draw newNode with both arrows
    var node = createNode((offsetX + ((idx + 1) * (nodeWidth + nodeSpace))),
        offsetY + nodeHeight, data, true, (idx + 1));
    updateDrawingArea();

    var node = $("#linkedlist").children().eq(idx + 1);
    node.attr("opacity", "0");

    //taking first the head in mind, and then the tail
    var i = idx + 2;
    var elementsToBeMoved;
    for (; i < linkedList.size() + 1; i++) {
        i === idx + 2 ? elementsToBeMoved = $("#linkedlist").children().eq(i)
            : elementsToBeMoved = elementsToBeMoved.add($("#linkedlist").children().eq(i));
    }

    var nNext = new Arrow($("#linkedlist").children().eq(idx + 1).children().eq(1));
    var nPrev = new Arrow($("#linkedlist").children().eq(idx + 1).children().eq(2));
    var npNext = new Arrow($("#linkedlist").children().eq(idx).children().eq(1));
    var nnPrev = new Arrow($("#linkedlist").children().eq(idx + 2).children().eq(2));

    p = $("#linkedlist").children().last();
    p.attr("opacity", 0);

    codeDisplayManager.loadFunctions("add");
    codeDisplayManager.changeFunction("add");


    appendAnimation(0, [{e: p, p: {opacity: 1}, o: {duration: animationTime}}], codeDisplayManager);

    var tmp = [
        npNext.animate(nodeSpace + nodeWidth, 0),
        nnPrev.animate(-(nodeSpace + nodeWidth), 0, null, true),
        {e: elementsToBeMoved, p: {x: "+" + (nodeWidth + nodeSpace)}, o: {duration: animationTime, position: "-=" + animationTime}},
        nPrev.animate(0, -(45 + 5), null, true),
        nNext.animate(0, -(15 + 55), null, true),
        {e: node, p: {opacity: 1}, o: {duration: animationTime/*, easing: "easeInOutExpo"*/, position: "-=" + animationTime}}
    ];
    appendAnimation(1, tmp, codeDisplayManager);

    appendAnimation(2, npNext.animate(-(nodeSpace + nodeWidth), (45 + 15)), codeDisplayManager);

    tmp = [
        nnPrev.animate((nodeSpace + nodeWidth), (45 + 15)),
        {e: node, p: {y: "+=" + (-nodeHeight)}, o: {duration: animationTime}},
        nPrev.animate(0, (45 + 5), null, true),
        nNext.animate(0, (15 + 45), null, true),
        npNext.animate(0, (45 + 15), null, true),
        nnPrev.animate(0, (15 + 45), null, true)
    ];
    appendAnimation(3, tmp, codeDisplayManager);

    appendCodeLines([4], codeDisplayManager);

    appendAnimation(5, [{e: node, p: {y: "+=0", onComplete: function (elements) {redraw()}}, o: {duration: 1}}], codeDisplayManager);
}



//STATUS: not converted to GSAP
function addByIndex(idx, data) {
    if (linkedList.size() === 0) {
        throw new Error("Linked List has not yet been initialized");
    }
    else if (idx < 0 || idx >= linkedList.size() - 1) {
        throw new Error("Index is out of range");
    }

    linkedList.add(idx + 1, data);

    // Get and draw p
    var p = createPointer('south',
        (offsetX + nodeWidth / 2 + ((nodeWidth + nodeSpace) * (idx + 1))),
        50,
        (offsetX + nodeWidth / 2 + ((nodeWidth + nodeSpace) * (idx + 1))),
        80);


    // Draw newNode with both arrows
    var node = createNode((offsetX + ((idx + 1) * (nodeWidth + nodeSpace))),
        offsetY + nodeHeight, data, true, (idx + 1));
    updateDrawingArea();

    var node = $("#linkedlist").children().eq(idx + 1);
    node.attr("opacity", "0");

    //taking first the head in mind, and then the tail
    var i = idx + 2;
    var elementsToBeMoved;
    for (; i < linkedList.size() + 1; i++) {
        i === idx + 2 ? elementsToBeMoved = $("#linkedlist").children().eq(i)
            : elementsToBeMoved = elementsToBeMoved.add($("#linkedlist").children().eq(i));
    }

    var nNext = new Arrow($("#linkedlist").children().eq(idx + 1).children().eq(1));
    var nPrev = new Arrow($("#linkedlist").children().eq(idx + 1).children().eq(2));
    var npNext = new Arrow($("#linkedlist").children().eq(idx).children().eq(1));
    var nnPrev = new Arrow($("#linkedlist").children().eq(idx + 2).children().eq(2));

    p = $("#linkedlist").children().last();
    p.attr("opacity", 0);

    codeDisplayManager.loadFunctions("add");
    codeDisplayManager.changeFunction("add");


    appendAnimation(0, [{e: p, p: {opacity: 1}, o: {duration: animationTime}}], codeDisplayManager);

    var npNext1 = npNext.animate(nodeSpace + nodeWidth, 0);
    var nnPrev1 = nnPrev.animate(-(nodeSpace + nodeWidth), 0, null, true);
    var nPrev1 = nPrev.animate(0, -(45 + 5), null, true);
    var nNext1 = nNext.animate(0, -(15 + 55), null, true);
    var tmp = [
        npNext1[0],
        npNext1[0],

        nnPrev1[0],
        nnPrev1[1],

        {e: elementsToBeMoved, p: {x: "+" + (nodeWidth + nodeSpace)}, o: {duration: animationTime, position: "-=" + animationTime}},

        nPrev1[0],
        nPrev1[1],

        nNext1[0],
        nNext1[1],

        {e: node, p: {opacity: 1}, o: {duration: animationTime/*, easing: "easeInOutExpo"*/, position: "-=" + animationTime}}
    ];
    appendAnimation(1, tmp, codeDisplayManager);

    var npNext2 = npNext.animate((nodeSpace + nodeWidth), (45 + 15));
    appendAnimation(2, [npNext2[0], npNext2[1]], codeDisplayManager);

    var nnPrev3 = nnPrev.animate(-(nodeSpace + nodeWidth), (45 + 15));
    var nPrev3 = nPrev.animate(0, (45 + 5), null, true);
    var nNext3 = nNext.animate(0, (15 + 45), null, true);
    var npNext3 = npNext.animate(0, (45 + 15), null, true);
    var nnPrev3 = nnPrev.animate(0, (15 + 45), null, true);
    tmp = [
        nnPrev3[0],
        nnPrev3[1],

        {e: node, p: {y: "+=" + (-nodeHeight)}, o: {duration: animationTime}},

        nPrev3[0],
        nPrev3[1],

        nNext3[0],
        nNext3[1],

        npNext3[0],
        npNext3[1],

        nnPrev3[0],
        nnPrev3[1]
    ];
    appendAnimation(3, tmp, codeDisplayManager);

    appendCodeLines([4], codeDisplayManager);

    appendAnimation(5, [{e: node, p: {y: "+=0", onComplete: function (elements) {redraw()}}, o: {duration: 1}}], codeDisplayManager);
}


function OLDaddByIndex(idx, data) {
    if (linkedList.size() === 0) {
        throw new Error("Linked List has not yet been initialized");
    }
    else if (idx < 0 || idx >= linkedList.size() - 1) {
        throw new Error("Index is out of range");
    }

    linkedList.add(idx + 1, data);

    // Get and draw p
    var p = createPointer('south',
        (offsetX + nodeWidth / 2 + ((nodeWidth + nodeSpace) * (idx + 1))),
        50,
        (offsetX + nodeWidth / 2 + ((nodeWidth + nodeSpace) * (idx + 1))),
        80);


    // Draw newNode with both arrows
    var node = createNode((offsetX + ((idx + 1) * (nodeWidth + nodeSpace))),
        offsetY + nodeHeight, data, true, (idx + 1));
    updateDrawingArea();

    var node = $("#linkedlist").children().eq(idx + 1);
    node.attr("opacity", "0");

    //taking first the head in mind, and then the tail
    var i = idx + 2;
    var elementsToBeMoved;
    for (; i < linkedList.size() + 1; i++) {
        i === idx + 2 ? elementsToBeMoved = $("#linkedlist").children().eq(i)
            : elementsToBeMoved = elementsToBeMoved.add($("#linkedlist").children().eq(i));
    }

    var nNext = $("#linkedlist").children().eq(idx + 1).children().eq(1);
    var nPrev = $("#linkedlist").children().eq(idx + 1).children().eq(2);
    var npNext = $("#linkedlist").children().eq(idx).children().eq(1);
    var nnPrev = $("#linkedlist").children().eq(idx + 2).children().eq(2);

    p = $("#linkedlist").children().last();
    p.attr("opacity", 0);

    codeDisplayManager.loadFunctions("add");
    codeDisplayManager.changeFunction("add");


    appendAnimation(0, [{e: p, p: {opacity: 1}, o: {duration: animationTime}}], codeDisplayManager);
    var tmp = [
        GSAPArrowAnimate(npNext, nodeSpace + nodeWidth, 0)[0],
        GSAPArrowAnimate(npNext, nodeSpace + nodeWidth, 0)[1],

        GSAPArrowAnimate(nnPrev, -(nodeSpace + nodeWidth), 0, true)[0],
        GSAPArrowAnimate(nnPrev, -(nodeSpace + nodeWidth), 0, true)[1],

        {e: elementsToBeMoved, p: {x: "+" + (nodeWidth + nodeSpace)}, o: {duration: animationTime, position: "-=" + animationTime}},

        GSAPArrowAnimate(nPrev, 0, -(45 + 5), true)[0],
        GSAPArrowAnimate(nPrev, 0, -(45 + 5), true)[1],

        GSAPArrowAnimate(nNext, 0, -(15 + 55), true)[0],
        GSAPArrowAnimate(nNext, 0, -(15 + 55), true)[1],

        {e: node, p: {opacity: 1}, o: {duration: animationTime/*, easing: "easeInOutExpo"*/, position: "-=" + animationTime}}
    ];
    appendAnimation(1, tmp, codeDisplayManager);

    appendAnimation(2, [
        GSAPArrowAnimate(npNext, (nodeSpace + nodeWidth), (45 + 15))[0],
        GSAPArrowAnimate(npNext, (nodeSpace + nodeWidth), (45 + 15))[1]
    ], codeDisplayManager);

    tmp = [
        GSAPArrowAnimate(nnPrev, -(nodeSpace + nodeWidth), (45 + 15))[0],
        GSAPArrowAnimate(nnPrev, -(nodeSpace + nodeWidth), (45 + 15))[1],

        {e: node, p: {y: "+=" + (-nodeHeight)}, o: {duration: animationTime}},

        GSAPArrowAnimate(nPrev, 0, (45 + 5))[0],
        GSAPArrowAnimate(nPrev, 0, (45 + 5))[1],

        GSAPArrowAnimate(nNext, 0, (15 + 45))[0],
        GSAPArrowAnimate(nNext, 0, (15 + 45))[1],

        GSAPArrowAnimate(npNext, 0, (45 + 15))[0],
        GSAPArrowAnimate(npNext, 0, (45 + 15))[1],

        GSAPArrowAnimate(nnPrev, 0, (15 + 45))[0],
        GSAPArrowAnimate(nnPrev, 0, (15 + 45))[1]
    ];
    appendAnimation(3, tmp, codeDisplayManager);

    appendCodeLines([4], codeDisplayManager);

    appendAnimation(5, [{e: node, p: {y: "+=0", onComplete: function (elements) {redraw()}}, o: {duration: 1}}], codeDisplayManager);
}


//STATUS: not converted to GSAP
//TODO: find a meaningful variable to take in
function removeNode(idx) {
    if (linkedList.size() === 0) {
        throw new Error("Linked List has not yet been initialized");
    }
    else if (idx < 0 || idx >= linkedList.size() - 2) {
        throw new Error("Index is out of range");
    }

    idx = idx + 1; //'cause u can't remove the head
    linkedList.removeByIdx(idx);

    var elementsToBeMoved;
    for (var i = idx + 1; i < linkedList.size() + 1; i++) {
        i === idx + 1 ? elementsToBeMoved = $("#linkedlist").children().eq(i)
            : elementsToBeMoved = elementsToBeMoved.add($("#linkedlist").children().eq(i));
    }

    var leftArrow = new Arrow($("#linkedlist").children().eq(idx - 1).children().eq(1));
    var rightArrow = new Arrow($("#linkedlist").children().eq(idx + 1).children().eq(2));

    codeDisplayManager.loadFunctions("removeNode");
    codeDisplayManager.changeFunction("removeNode");
    var line0 = codeDisplayManager.getVelocityFramesForHighlight(0, animationTime);
    var line1 = codeDisplayManager.getVelocityFramesForHighlight(1, animationTime);
    var line2 = codeDisplayManager.getVelocityFramesForHighlight(2, animationTime);
    var line3 = codeDisplayManager.getVelocityFramesForHighlight(3, animationTime);
    var line4 = codeDisplayManager.getVelocityFramesForHighlight(4, animationTime);

    $.Velocity.RunSequence([
        line0[0],
        rightArrow.animate(-(nodeWidth + nodeSpace), 0, 60),
        line0[1],
        line1[0],
        leftArrow.animate((nodeWidth + nodeSpace), 0, -60),
        { e: $("#linkedlist").children().eq(idx), p: "fadeOut", o: { duration: animationTime} },
        rightArrow.animate((nodeWidth + nodeSpace), 0, -60, false),
        leftArrow.animate(-(nodeWidth + nodeSpace), 0, 60, false),
        { e: elementsToBeMoved, p: { translateX: "-" + (nodeWidth + nodeSpace) }, o: { duration: animationTime, sequenceQueue: false } },
        line1[1],
        line2[0],
        line2[1],
        line3[0],
        line3[1],
        line4[0],
        line4[1],
        { e: $("#linkedlist"), p: { translateY: "+=0" }, o: { duration: 1, complete: function (elements) { redraw() } } }
    ]);
}

//STATUS: not converted to GSAP
//TODO: finish this together with highlightCode
function getNode(idx) {
    var loadingSequence = [];
    codeDisplayManager.loadFunctions("getNode");
    codeDisplayManager.changeFunction("getNode");
    var lines = [];
    for(var i = 0; i <= 12; i++) {
        lines[i] = codeDisplayManager.getVelocityFramesForHighlight(i, animationTime);
    }
    loadingSequence.push(lines[0][0], lines[0][1]);
    loadingSequence.push(lines[1][0], lines[1][1]);

    if (idx < (linkedList.size() - 1) / 2) {
        loadingSequence.push(lines[2][0]);
        var p = createPointer('south',
            offsetX + nodeWidth + nodeSpace + nodeWidth / 2,
            50, offsetX + nodeWidth + nodeSpace + nodeWidth / 2, 80);
        updateDrawingArea();
        p = $("#linkedlist").children().last();
        p.attr("opacity", 0);

        loadingSequence.push({e: p, p: "transition.expandIn", o: { duration: animationTime }});
        p = new Arrow($("#linkedlist").children().last());
        loadingSequence.push(lines[2][1], lines[3][0]);
        for (var i = 0; i < idx ; i++) {
            loadingSequence.push(lines[3][1], lines[4][0]);
            loadingSequence.push(p.translateStraightArrow((nodeWidth + nodeSpace), 0));
            loadingSequence.push(lines[4][1], lines[3][0]);
        }
        loadingSequence.push(lines[3][1], lines[5][0], lines[5][1], lines[6][0]);
    }
    else {
        loadingSequence.push(lines[6][0], lines[6][1], lines[7][0], lines[7][1]);
        var p = createPointer('south',
            offsetX + (nodeWidth + nodeSpace) * (linkedList.size() - 1) + nodeWidth / 2,
            50, offsetX + (nodeWidth + nodeSpace) * (linkedList.size() - 1) + nodeWidth / 2, 80);
        loadingSequence.push(lines[7][0]);
        updateDrawingArea();

        p = $("#linkedlist").children().last();
        p.attr("opacity", 0);
        loadingSequence.push({e: p, p: "transition.expandIn", o: { duration: animationTime }});
        p = new Arrow($("#linkedlist").children().last());
        for (var i = linkedList.size() - 2; i > idx ; i--) {
            loadingSequence.push(p.translateStraightArrow(-(nodeWidth + nodeSpace), 0));
        }
    }
    loadingSequence.push(lines[6][1], lines[12][0], lines[12][1]);

    $.Velocity.RunSequence(loadingSequence);

}

//STATUS: not converted to GSAP
function findPos(data) {
    var p = createPointer('south',
        offsetX + nodeSpace + nodeWidth + nodeWidth / 2, 50,
        offsetX + nodeSpace + nodeWidth + nodeWidth / 2, 80);
    updateDrawingArea();
    p = new Arrow($("#linkedlist").children().last());
    var loadingSequence = [];

    for (var i = 1; i < linkedList.size() - 1; i++) {
        if($("#linkedlist").children().eq(i).children().first().text() == data) {
            break;
        }
        loadingSequence.push(p.translateStraightArrow(nodeWidth + nodeSpace, 0));
    }
    $.Velocity.RunSequence(loadingSequence);

    //TODO: remove this later
    setTimeout(function() {
        redraw();
    }, 3000);
}



//Iterator
//STATUS: not converted to GSAP
function iterator(idx) {
    var p = createPointer('south',
        offsetX + (nodeSpace + nodeWidth) * (idx + 1) + nodeWidth / 2, 50,
        offsetX + (nodeSpace + nodeWidth) * (idx + 1) + nodeWidth / 2, 80);
    $("#linkedlist").children().last().attr("opacity", "0");
    updateDrawingArea();
    $("#linkedlist").children().last().velocity("fadeIn", { duration: animationTime });
    $("#linkedlist").children().last().attr("opacity", "1");
}

//STATUS: not converted to GSAP
function iteratorNext() {
    p = new Arrow($("#linkedlist").children().last());
    $.Velocity.RunSequence([p.translateStraightArrow(nodeWidth + nodeSpace, 0)]);
}

//STATUS: not converted to GSAP
function iteratorPrev() {
    p = new Arrow($("#linkedlist").children().last());
    $.Velocity.RunSequence([p.translateStraightArrow(-(nodeWidth + nodeSpace), 0)]);
}



function arrowTester() {
    codeDisplayManager = new CodeDisplayManager("javascript", "linkedlist");
    codeDisplayManager.loadFunctions("add");
    codeDisplayManager.changeFunction("add");

    createNode(offsetX, offsetY, 'H', 'Head', -1, true, true);
    updateDrawingArea();

    var node = new Arrow($("#linkedlist").children().eq(0).children().eq(1));
    console.log(node);
    var ani1 = node.animate(50, 0);
    var ani2 = node.animate(50, 0);
    appendAnimation(0, [ani1], codeDisplayManager);
    appendAnimation(1, [ani2], codeDisplayManager);
}