var platformX = 0;
var platformY = 500;
var platformWidth = 600;
var platformHeight = 20;
var pegWidth = 10;
var pegHeight = 250;

// Totally scalable with the global variables
function setPlatform() {
    $("#pegs")
        .append(createRect(platformWidth / 3 * 0.5 - (pegWidth / 2) + platformX, platformY - pegHeight, pegWidth, pegHeight+10))
        .append(createRect(platformWidth / 3 * 1.5 - (pegWidth / 2) + platformX, platformY - pegHeight, pegWidth, pegHeight+10))
        .append(createRect(platformWidth / 3 * 2.5 - (pegWidth / 2) + platformX, platformY - pegHeight, pegWidth, pegHeight+10))
        .append(createRect(platformX, platformY, platformWidth, platformHeight));
    updateSVG();
}

function initialize() {

}

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

