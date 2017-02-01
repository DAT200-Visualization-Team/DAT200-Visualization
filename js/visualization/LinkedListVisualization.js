var nodes = [];

function initialize() {
    clear();
    var startPos = 120;
    createHead(startPos);
    createTail(startPos + 60);

    // update drawingArea
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

function initializeAndAdd(elements) {
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
function createNode(pos, name, id) {
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
    (arguments.length === 3) ? n.attr("id", id) : n.attr("class", "node");
    nodes.push(n);
    $('svg').append(n);
}

function createHead(pos) {
    createNull(pos, 'left');
    createNode(pos, 'H', 'Head');
}

function createTail(pos) {
    createNode(pos, 'T', 'Tail');
    createNull(pos, 'right');
}

function clear() {
    $('svg').empty();
    nodes = [];
}

function testVelocity() {
    initializeAndAdd(4);
    var ball = $("#Head").children()[0].children[0];
    console.log(ball);
    //$.Velocity.hook($element, "translateX", "500px");
}