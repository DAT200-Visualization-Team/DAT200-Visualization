// Global variables are set so that
// the functions can be totally scalable

var platformX = 0;
var platformY = 500;
var platformWidth = 600;
var platformHeight = 20;
var pegWidth = 10;
var pegHeight = 250;
var maxDiskWidth = 200;
var diskWidthDiff = 20;
var diskHeight = 20;

var pegA = [];
var pegB = [];
var pegC = [];

var xPosPegA = 0;
var xPosPegB = 0;
var xPosPegC = 0;

var animationTime = 1000;

function updateSVG() {
    $(".towerOfHanoiContainer").html($(".towerOfHanoiContainer").html());
}

function createRect(x, y, width, height, rx, ry) {
    if (rx == null || ry == null) {
        rx = 10;
        ry = 10;
    }
    return '<rect x="' + x + '" y="' + y
        + '" width="' + width + '" height="' + height
        + '" rx="' + rx + '" ry="' + ry + '" />';
}

function setPlatform() {
    $("#pegs")
        .append(createRect(platformWidth / 3 * 0.5 - (pegWidth / 2) + platformX, platformY - pegHeight, pegWidth, pegHeight+10))
        .append(createRect(platformWidth / 3 * 1.5 - (pegWidth / 2) + platformX, platformY - pegHeight, pegWidth, pegHeight+10))
        .append(createRect(platformWidth / 3 * 2.5 - (pegWidth / 2) + platformX, platformY - pegHeight, pegWidth, pegHeight+10))
        .append(createRect(platformX, platformY, platformWidth, platformHeight));
    xPosPegA = parseInt($("#pegs").children().eq(0).attr("x")) + (pegWidth / 2);
    xPosPegB = parseInt($("#pegs").children().eq(1).attr("x")) + (pegWidth / 2);
    xPosPegC = parseInt($("#pegs").children().eq(2).attr("x")) + (pegWidth / 2);
    //updateSVG();
}

// Disks are created out of the viewport in the y-direction,
// so that animating "disk-drops" can be done easily.
// Animate each disk 1000px down and all will be good.
function setDisks(n, from) {
    var disks = [];
    var y = platformY - diskHeight - 1000;
    switch (from) {
        case 'A':
            var x = platformWidth / 3 * 0.5;
            break;
        case 'B':
            var x = platformWidth / 3 * 1.5;
            break;
        case 'C':
            var x = platformWidth / 3 * 2.5;
            break;
    }

    for (var i = 0; i < n; i++) {
        disks.push('<rect x="' + (x - (maxDiskWidth - (i * diskWidthDiff)) / 2)
            + '" y="' + (y - (i * diskHeight))
            + '" width="' + (maxDiskWidth - (i * diskWidthDiff))
            + '" height="' + diskHeight
            + '" rx="10" ry="10" class="disk" id="disk' + (n - i) + '" />')
    }

    return disks;
}

function initialize(disks, from , to) {
    setPlatform();
    var disks = setDisks(disks, from);
    for (var i = 0; i < disks.length; i++) {
        $("#peg" + from ).prepend(disks[i]);
        window["peg" + from].push(i + 1);
    }
    updateSVG();

    return { e: $("#peg" + from), p: { translateY: "+=1000px" }, o: { duration: animationTime, easing: "easeInSine"} };
}

function moveDisk(disk, from, to) {
    var movement = [];

    // move up
    movement.push({ e: $("#disk" + disk), p: { y: "-= " + (pegHeight + 2 * diskHeight)}, o: { duration: animationTime, easing: "easeInSine" } });

    // move to peg
    //var xPos = 0 - parseInt($("#disk" + disk).attr("x")) - parseInt($("#disk" + disk).attr("width") / 2);
    var xPos = 0 - parseInt(window["xPosPeg" + from]) /*- parseInt($("#disk" + disk).attr("width") / 2)*/;
    if (to === "A")
        xPos += platformWidth / 3 * 0.5;
    else if (to === "B")
        xPos += platformWidth / 3 * 1.5;
    else if (to === "C")
        xPos += platformWidth / 3 * 2.5;

    //console.log("Disk " + disk + "'s xPos" + xPos);

    movement.push({ e: $("#disk" + disk), p: { x: "+= " + xPos}, o: { duration: animationTime, easing: "easeInSine" } });

    // move down
    var yPos = (pegHeight + 2 * diskHeight)
        + diskHeight * (window["peg" + from].length - 1) /*($("#peg" + from).children().length - 1)*/
        - diskHeight * (window["peg" + to].length) /*$("#peg" + to).children().length*/;
    movement.push({ e: $("#disk" + disk), p: { y: "+= " + yPos }, o: { duration: animationTime, easing: "easeInSine" } });

    findAndRemoveDisk(disk);
    window["peg" + to].push(disk);
    /*console.log("pegA: " + pegA);
    console.log("pegB: " + pegB);
    console.log("pegC: " + pegC);*/

    return movement;
}

function findAndRemoveDisk(disk) {
    if (pegA.indexOf(disk) !== -1) {
        pegA.splice(pegA.indexOf(disk), 1);
        return "pegA";
    }
    else if (pegB.indexOf(disk) !== -1) {
        pegB.splice(pegB.indexOf(disk), 1);
        return "pegB";
    }
    else if (pegC.indexOf(disk) !== -1) {
        pegC.splice(pegC.indexOf(disk), 1);
        return "pegC";
    }
}

function sendCommands(commands) {
    var loadingSequence = [];
    var init = initialize(9, "A", "C");
    loadingSequence.push(init);
    for (var i = 0; i < commands.length; i++) {
        var movedisk = moveDisk(commands[i][0], commands[i][1], commands[i][2]);
        loadingSequence.push(movedisk[0]);
        loadingSequence.push(movedisk[1]);
        loadingSequence.push(movedisk[2]);
    }
    $.Velocity.RunSequence(loadingSequence);

}

function testSeqAnimating() {
    var init = initialize(3, "A", "C");
    var movedisk = moveDisk(1, "A", "C");

    loadingSequence = [
        init,
        movedisk[0],
        movedisk[1],
        movedisk[2]
    ];

    $.Velocity.RunSequence(loadingSequence);
}

function testSomeMore(disk, from, to) {
    var movedisk = moveDisk(disk, from, to);

    loadingSequence = [
        movedisk[0],
        movedisk[1],
        movedisk[2]
    ];

    $.Velocity.RunSequence(loadingSequence);

}
