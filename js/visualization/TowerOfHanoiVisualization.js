// Global variables are set so that
// the functions can be totally scalable

var platformX = 0;
var platformY = 500;
var platformWidth = 600;
var platformHeight = 20;
var pegWidth = 14; // must be an even number
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

var animationTime = 1;

var codeDisplayManager;

$(document).ready(function () {
    $('select').material_select();
    setPlatform();
    updateSVG();
});

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

    $("#pegs")
        .append('<text x="' + (xPosPegA) + '" y="' + (platformY + platformHeight + 40) + '" font-size="24px" text-anchor="middle">A</text>')
        .append('<text x="' + (xPosPegB) + '" y="' + (platformY + platformHeight + 40) + '" font-size="24px" text-anchor="middle">B</text>')
        .append('<text x="' + (xPosPegC) + '" y="' + (platformY + platformHeight + 40) + '" font-size="24px" text-anchor="middle">C</text>');

    codeDisplayManager = new CodeDisplayManager("javascript", "hanoi");
}

// Disks are created out of the viewport in the y-direction,
// so that animating "disk-drops" can be done easily.
// Animate each disk 1000px down and all will be good.
function setDisks(n, from) {
    var disks = [];
    var y = platformY - diskHeight /*- 1000*/;

    // Resize
    diskWidthDiff = Math.pow((n - 9), 2) + 20;

    for (var i = 0; i < n; i++) {
        disks.push('<rect x="' + (window["xPosPeg" + from] - (maxDiskWidth - (i * diskWidthDiff)) / 2)
            + '" y="' + (y - (i * diskHeight))
            + '" width="' + (maxDiskWidth - (i * diskWidthDiff))
            + '" height="' + diskHeight
            + '" rx="10" ry="10" class="disk" id="disk' + (n - i) + '" />')
    }

    return disks;
}

function initialize(disks, from) {
    setPlatform();
    var disks = setDisks(disks, from);
    for (var i = 0; i < disks.length; i++) {
        $("#disks").prepend(disks[i]);
        window["peg" + from].push(i + 1);
    }
    updateSVG();

    //return { e: $("#disks"), p: { y: "+=1000", easing:Power3.easeOut}, o: { duration: animationTime} };
}

function moveDisk(disk, from, to) {
    var movement = [];

    // move up
    movement.push({ e: $("#disk" + disk), p: { y: "-=" + (pegHeight + 2 * diskHeight), ease:Power1.easeOut }, o: { duration: animationTime} });

    // move to peg
    var xPos = -parseInt(window["xPosPeg" + from]);
    if (to === "A")
        xPos += platformWidth / 3 * 0.5;
    else if (to === "B")
        xPos += platformWidth / 3 * 1.5;
    else if (to === "C")
        xPos += platformWidth / 3 * 2.5;

    movement.push({ e: $("#disk" + disk), p: { x: "+=" + xPos, ease:Power1.easeOut }, o: { duration: animationTime } });

    // move down
    var yPos = (pegHeight + 2 * diskHeight)
        + diskHeight * (window["peg" + from].length - 1)
        - diskHeight * (window["peg" + to].length);
    movement.push({ e: $("#disk" + disk), p: { y: "+=" + yPos, ease: Bounce.easeOut }, o: { duration: animationTime } });

    removeDiskFromOldPeg(disk);
    window["peg" + to].push(disk);

    return movement;
}

function removeDiskFromOldPeg(disk) {
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


function resetGUI() {
    $("#pegs").children().remove();
    $("#disks").children().remove();
    pegA = [];
    pegB = [];
    pegC = [];
}

function sendCommands(commands, disks, from, to, temp) {
    //TODO: animate the disks falling down on platform at initialize
    //appendAnimation(null, initialize(disks, from), null);
    initialize(disks, from);
    codeDisplayManager.loadFunctions("hanoi1");
    codeDisplayManager.changeFunction("hanoi1");
    codeDisplayManager.setVariable("disks", disks.toString());
    codeDisplayManager.setVariable("from", from.toString());
    codeDisplayManager.setVariable("to", to.toString());
    codeDisplayManager.setVariable("temp", temp.toString());

    for (var i = 0; i < commands.length; i++) {
        if (commands[i] instanceof Array) {
            updateVariable("disks", commands[i][0].toString());
            updateVariable("from", commands[i][1].toString());
            updateVariable("to", commands[i][2].toString());
            updateVariable("temp", commands[i][3].toString());
            var movedisk = moveDisk(commands[i][0], commands[i][1], commands[i][2]);
            appendAnimation(3, [movedisk[0], movedisk[1], movedisk[2]], codeDisplayManager);
        } else {
            appendCodeLines([commands[i]], codeDisplayManager);
        }
    }
}

