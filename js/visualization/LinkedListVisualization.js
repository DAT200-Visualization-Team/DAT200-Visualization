var nodes = [];
var states = [];
var currentState = 0;
var totalStates = 0;
var startPos = 120;
var debuggerLine = 1;

function saveState() {
    states.push(nodes);
    currentState++;
    totalStates++;
}

//way: f(orwards) / b(ackwards)
function traverseState(way) {
    if (way === "f") {
        if (currentState < totalStates) {
            events[++currentState];
        }
        else {
            console.log("Most recent state");
        }
    } else if (way === "b") {
        if (currentState === 0) {
            console.log("Oldest state saved");
        } else {
            events[--currentState];
        }
    }
    redraw();
}


function initialize() {
    clear();
    var startPos = 120;
    createHead(startPos);
    createTail(startPos + 60);

    // update drawingArea
    $(".drawingArea").html($(".drawingArea").html());
}

function initializeAndAdd(elements) {
    clear();
    var startPos = 120;
    createHead(startPos);
    var i = 1;
    while(i <= elements) {
        startPos += 60;
        createNode(startPos, i);
        i++;
    }

    createTail(startPos + 60);

    // update drawingArea
    $(".drawingArea").html($(".drawingArea").html());
}

function initialize1() {
    clear();
    debugStepOver();
    createHead(startPos);
    createTail(startPos + 120);
    updateDrawingArea();


    var head = $("#linkedlist").children().first();
    var tail = $("#linkedlist").children().last();

    tail.attr("opacity", "0");

    head.velocity( "transition.expandIn", {
            duration: 500, complete: function () {
                debugStepOver();
            }
        }
    );

    debugStepOver();
    head.velocity("transition.expandIn", {
            duration: 1000,
            complete: function() {
                debugStepOver();
                tail.attr("opacity", "1");
                tail.velocity("transition.expandIn", {
                    duration: 1000,
                        complete: function() {
                            moveArrow(1, 'prevArrow', -60, 0);
                            debugStepOver();
                            moveArrow(0, 'nextArrow', 60, 0);
                        }
                    }
                )
            }
        }
    );
}

function testProgress(x, y, dx, dy) {
    clear();
    var arrow = $("<g></g>");
    var type = "nextArrow";
    arrow.addClass(type);
    var x1 = x + dx;
    var y1 = y + dy;
    var mx = (x + x1) / 2;
    var my = y - 30;
    var p1 = 'M ' + (x1+5) + ' ' + (y1-5) + ' ';
    var p2 = 'L ' + (x1-5) + ' ' + (y1+5) + ' ';
    var p3 = 'L ' + (x1+5) + ' ' + (y1+5) + ' ';
    var arch = '<path d="M ' + x + ' ' + y + ' Q ' + mx + ' ' + my + ' ' + x1 + ' ' + y1 + '" class="' + type + 'Line" />';
    var triangle = '<path d="' + p1 + p2 + p3 + 'Z" class="' + type + 'Head" />';
    arrow.append(arch);
    arrow.append(triangle);
    $("#linkedlist").append(arrow);
    updateDrawingArea();

    var arch = $("#linkedlist").children().first().children().first();

    //console.log(arch);

    var minEndPoint = 100;

   arch.velocity({
       tween: 1},
       {duration: 3000 ,
        progress: function(elements, complete, remaining, start, tweenValue) {
            elements[0].setAttribute("d", "M 35 20 Q 60 -10 " + ((tweenValue * 100) + minEndPoint) + " 20");
            //console.log(elements[0].getAttribute("d"));
        }
    });

}


function debugStepOver() {
    var code = $('#code pre code');
    if (debuggerLine > 0) {
        var previousLine = code.children().eq(debuggerLine - 1);
        previousLine.removeClass("highlightLine");
    }
    var line = code.children().eq(debuggerLine);
    line.attr("class", "highlightLine");

    //funker ikke
    (line !== code.children().last()) ? debuggerLine++ : console.log("No further lines");
    console.log(line);
}

function updateDrawingArea() {
    $(".drawingArea").html($(".drawingArea").html());
}

function add(data) {
    if (nodes.length === 0) {
        throw new Error("Linked List has not yet been initialized");
    }
    $('svg g:last').remove();
    $('#Tail').remove();
    nodes.pop();

    var pos = 120;
    for(var i = 0; i < nodes.length; i++) {
        pos += 60;
    }

    createNode(pos, data);
    createTail(pos+60);

    $(".drawingArea").html($(".drawingArea").html());
}

function addWithIndex(idx, data) {
    if (nodes.length === 0) {
        throw new Error("Linked List has not yet been initialized");
    }
    var startPos = 120 + 60;
    var node = createFreeNode((startPos + (idx * 60)), 180, data, true, (idx + 1));
    node.attr("class", "node");
    node.insertBefore($("#linkedlist").children().eq(idx + 1));
    console.log(node);

    $(".drawingArea").html($(".drawingArea").html());

    //taking the head in mind, and then the tail and other null
    var i = idx + 2;
    var elementsToBeMoved;
    for(; i < nodes.length + 1; i++) {
        i === idx + 2 ? elementsToBeMoved = $("#linkedlist").children().eq(i)
            : elementsToBeMoved = elementsToBeMoved.add($("#linkedlist").children().eq(i));
    }
    elementsToBeMoved
        .velocity(
            { translateX: "+=60", translateY: "+=0" },
            {duration: "3000", easing: "easeInOutExpo",
                complete: function() {
                    $("#linkedlist").children().eq(idx + 1)
                        .velocity({ translateX: "+=0", translateY: "-=130" },
                            {duration: "3000", easing: "easeInOutExpo",
                                complete: function() {
                                    redraw();
                                }
                            }
                        );
                }
            }
        );
}

function redraw() {
    var arr = nodes;
    clear();
    var startPos = 120;
    var pos = startPos + 60;
    createHead(startPos);

    for(var i = 1; i < arr.length - 1; i++, pos += 60) {
        var data = arr[i].children().first().children().last().text();
        createNode(pos, data);
    }
    createTail(pos);
    /*
    createTail(startPos + (nodes.length * 60));*/
    $(".drawingArea").html($(".drawingArea").html());

}

// int: which node, string: nextArrow/prevArrow, int, int
function moveArrow(nodeNum, arrow, dx, dy) {
    arrow = $("svg ." + arrow)[ nodeNum ];

    var arrowArch = arrow.firstElementChild;
    var d = arrowArch.getAttribute('d');
    var dArr = d.split(" ");
    dArr[6] = parseInt(dArr[6]) + dx;
    dArr[7] = parseInt(dArr[7]) + dy;
    dArr[4] = parseInt(dArr[4]) + dx/2;
    dArr[5] = parseInt(dArr[5]) + dy/2;
    d = dArr.toString().replace(/,/g , " ");
    arrowArch.setAttribute("d", d);

    var arrowHead = arrow.lastElementChild;
    var d = arrowHead.getAttribute('d');
    var dArr = d.split(" ");
    dArr[1] = parseInt(dArr[1]) + dx;
    dArr[4] = parseInt(dArr[4]) + dx;
    dArr[7] = parseInt(dArr[7]) + dx;
    dArr[2] = parseInt(dArr[2]) + dy;
    dArr[5] = parseInt(dArr[5]) + dy;
    dArr[8] = parseInt(dArr[8]) + dy;
    d = dArr.toString().replace(/,/g , " ");
    arrowHead.setAttribute("d", d);

    $(".drawingArea").html($(".drawingArea").html());
}

function remove() {
    if (nodes.length === 2) {
        throw new Error("No elements to be removed");
    }
    $('svg g:last').remove();
    $('#Tail').remove();
    $('svg g:last').remove();
    $('svg g:last').remove();
    $('svg g:last').remove();
    $('svg g:last').remove();

    nodes.pop();
    nodes.pop();

    var pos = 120;
    for(var i = 0; i < nodes.length; i++) {
        pos += 60;
    }
    createTail(pos);

    $(".drawingArea").html($(".drawingArea").html());
}

// Let x be position of the node that points to the null
function createNull(x, dir) {
    var nullElement = $('<g></g>');
    if (dir === 'right') {
        x += 60;
        nullElement
            .append('<rect x="' + x + '" y="25" rx="10" ry="10"></rect>')
            .append('<text x="' + (x+25) + '" y="37" dy=".3em">null</text>');
    } else {
        x -= 110;
        nullElement
            .append('<rect x="' + x + '" y="50" rx="10" ry="10"></rect>')
            .append('<text x="' + (x+25) + '" y="63" dy=".3em">null</text>');
    }
    $('svg').append(nullElement);
}

// In use with createNode()
function createArrow(type, from) {
    var arrow = $("<g></g>");
    arrow.addClass(type);
    if (type === "nextArrow") {
        var to = from + 50;
        var y = 20;
        var mx = (from + to) / 2;
        var my = -10;

        var p1 = 'M ' + (to+5) + ' ' + (y-5) + ' ';
        var p2 = 'L ' + (to-5) + ' ' + (y+5) + ' ';
        var p3 = 'L ' + (to+5) + ' ' + (y+5) + ' ';
    }
    else {
        var to = from - 50;
        var y = 80;
        var mx = (from + to) / 2;
        var my = 110;

        var p1 = 'M ' + (to-5) + ' ' + (y+5) + ' ';
        var p2 = 'L ' + (to+5) + ' ' + (y-5) + ' ';
        var p3 = 'L ' + (to-5) + ' ' + (y-5) + ' ';
    }
    var arch = '<path d="M ' + from + ' ' + y + ' Q ' + mx + ' ' + my + ' ' + to + ' ' + y + '" class="' + type + 'Line" />';
    var triangle = '<path d="' + p1 + p2 + p3 + 'Z" class="' + type + 'Head" />';

    arrow.append(arch);
    arrow.append(triangle);
    return arrow;
}

// Let distance between nodes be 60px
function createNode(pos, name, manualAppend, id) {
    var n = $('<g></g>');
    var nData = $('<g></g>');
    nData
        .addClass("data")
        .append('<circle cx="' + pos + '" cy="50" r="30"></circle>')
        .append('<text x="' + pos + '" y="50" dy=".3em">' + name + '</text>');
    var nNext = createArrow("nextArrow", pos + 5);
    var nPrev = createArrow("prevArrow", pos - 5);

    n
        .append(nData)
        .append(nNext)
        .append(nPrev);
    (arguments.length === 4) ? n.attr("id", id) : n.attr("class", "node");
    nodes.push(n);

    if(manualAppend === true) {
        return n;
    }

    $('svg').append(n);
    return n;
}

function createHead(pos) {
    //createNull(pos, 'left');
    return createNode(pos, 'H', false, 'Head');
}

function createTail(pos) {
    return createNode(pos, 'T', false, 'Tail');
    //createNull(pos, 'right');
}

/***
 * @param posX
 * @param posY
 * @param data
 * @param manualAppend
 * @param id
 * @param idx: placement of node in nodes-array
 * @returns {*|jQuery|HTMLElement}
 * TODO: erstatt manualAppend med funksjonalitet vha. idx som setter inn HTML-elementet riktig i DOM istedenfor at det blir gjort utenfor
 */
function createFreeNode(posX, posY, data, manualAppend, idx, id) {
    var n = $('<g></g>');
    var nData = $('<g></g>');
    nData
        .addClass("data")
        .append('<circle cx="' + posX + '" cy="' + posY +'" r="30"></circle>')
        .append('<text x="' + posX + '" y="' + posY +'" dy=".3em">' + data + '</text>');
    var nNext = createFreeArrow("nextArrow", posX + 5, posY - 30, 50, 0);
    var nPrev = createFreeArrow("prevArrow", posX - 5, posY + 30 , 50, 0);

    n
        .append(nData)
        .append(nNext)
        .append(nPrev);
    (arguments.length === 4) ? n.attr("id", id) : n.attr("class", "node");

    for (var i = nodes.length; i > idx; i--) {
        nodes[i] = nodes[i - 1]
    }
    nodes[idx] = n;

    if(manualAppend === true) {
        return n;
    }

    $('svg').append(n);
}

function createFreeArrow(type, x, y, dx, dy) {
    var arrow = $("<g></g>");
    arrow.addClass(type);
    if (type === "nextArrow") {
        var x1 = x + dx;
        var y1 = y + dy;
        var mx = (x + x1) / 2;
        var my = y - 30;

        var p1 = 'M ' + (x1+5) + ' ' + (y1-5) + ' ';
        var p2 = 'L ' + (x1-5) + ' ' + (y1+5) + ' ';
        var p3 = 'L ' + (x1+5) + ' ' + (y1+5) + ' ';
    }
    else {
        var x1 = x - dx;
        var y1 = y - dy;
        var mx = (x + x1) / 2;
        var my = y + 30;

        var p1 = 'M ' + (x1-5) + ' ' + (y1+5) + ' ';
        var p2 = 'L ' + (x1+5) + ' ' + (y1-5) + ' ';
        var p3 = 'L ' + (x1-5) + ' ' + (y1-5) + ' ';
    }
    var arch = '<path d="M ' + x + ' ' + y + ' Q ' + mx + ' ' + my + ' ' + x1 + ' ' + y1 + '" class="' + type + 'Line" />';
    var triangle = '<path d="' + p1 + p2 + p3 + 'Z" class="' + type + 'Head" />';

    arrow.append(arch);
    arrow.append(triangle);
    return arrow;
}

function clear() {
    $('svg').empty();
    nodes = [];
}

/***
 * ANIMATIONS
 */
function animAppear(elementToAnimate, nextAnimation, nextElementToAnimate) {
    elementToAnimate
        .velocity(
            {translateY: "-=30"},
            {duration: "50", easing: "easeOutBounce"}
        ).velocity(
            {translateY: "+=60"},
            {duration: "100", easing: "easeOutBounce"}
        ).velocity(
            {translateY: "-=30"},
            {duration: "100", easing: "easeOutBounce",
                complete: function() {
                    switch(nextAnimation) {
                        case 'appear':
                            animAppear(nextElementToAnimate);
                        case null:
                            return;
                    }

                }
            }
        );
}

// Input is jQuery element
function aniMoveArrow(arrow, dx, dy) {
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
    //console.log();

    arrow.children().velocity(
        {tween: 1},
        {duration: 2000 ,
            progress: function(elements, complete, remaining, start, tweenValue) {
                console.log(elements);
                elements[0].setAttribute(
                    "d", "M " + x0 + " " + y0 + " Q " + ((x0 + x1 + (tweenValue * dx)) / 2) + " " + -10 + " " + ((tweenValue * dx) + x1) + " " + ((tweenValue * dy) + y1)
                );
                elements[1].setAttribute(
                    "d", "M " + (p0x + (dx * tweenValue)) + " " + (p0y + (dy * tweenValue)) + " L " + (p1x + (dx * tweenValue)) + " " + (p1y + (dy * tweenValue)) + " L " + (p2x + (dx * tweenValue)) + " " + (p2y + (dy * tweenValue) + " Z")
                );

            }
        }
    );


}

