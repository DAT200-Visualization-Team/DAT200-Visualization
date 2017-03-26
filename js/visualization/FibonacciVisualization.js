var codeDisplayManager = new CodeDisplayManager("javascript", "fibonacci");
var lines = [];
var animationTime = 100;
var loadingSequence = [];

function runIterativeFib(n) {
    $("#fibonacci").empty();
    lines = [];
    loadingSequence = [];
    codeDisplayManager.loadFunctions("iterativeFib");
    codeDisplayManager.changeFunction("iterativeFib");
    for (var i = 0; i < 17; i++) {
        lines.push(codeDisplayManager.getVelocityFramesForHighlight(i, animationTime));
    }
    iterativeFib(n);
    animate();
}

function iterativeFib(n) {
    highlight(0, 2);
    if (n <= 0) {
        highlight(1, 2);
        throw new {name: "IllegalArgumentException", message: "The Fibonacci numbers start at 1."};
    }
    highlight(2, 2);
    if (n === 1) {
        return 1;
    }
    highlight(3, 2);
    if (n === 2) {
        return 1;
    }

    initialize();

    highlight(5, 0);
    var nMinusTwo = 1;
    fadeInAndMark("nMinusTwo", 0);
    highlight(5, 1);

    highlight(6, 0);
    var nMinusOne = 1;
    fadeInAndMark("nMinusOne", 1);
    highlight(6, 1);


    highlight(7, 2);
    var result = 0;

    for (var i = 3; i <= n; i++) {
        highlight(9, 2);


        highlight(10, 0);
        result = nMinusOne + nMinusTwo;
        forLoopAnimation(result, 0);
        highlight(10, 1);

        highlight(11, 0);
        nMinusTwo = nMinusOne;
        forLoopAnimation(result, 1);
        highlight(11, 1);

        highlight(12, 0);
        nMinusOne = result;
        forLoopAnimation(result, 2);
        highlight(12, 1);

        highlight(13, 2);
    }

    highlight(15, 0);
    markResult();
    highlight(15, 1);

    highlight(16, 2);

}

function initialize() {
    $("#fibonacci").append('<div id="nMinusMarker" style="opacity: 0; display: inline-flex;"><h4 id="plusMark" style="opacity: 0">+</h4></div>');
    $("#fibonacci").append('<div class="fibonacci-entry"><h4 class="fibonacci-value noselect" id="nMinusTwo" style="opacity: 0">1</h4></div>');
    $("#fibonacci").append('<div class="fibonacci-entry"><h4 class="fibonacci-value noselect" id="nMinusOne" style="opacity: 0">1</h4></div>');

}

function fadeInAndMark(id, part) {
    loadingSequence.push({e: $("#" + id), p: {opacity: 1}, o: {duration: animationTime, display: 'inline-block'}});
    if (part === 0)
        loadingSequence.push({
            e: $("#nMinusMarker"),
            p: {opacity: 1},
            o: {duration: animationTime, display: 'inline-block', sequenceQueue: false}
        });

    else if (part === 1)
        loadingSequence.push({
            e: $("#nMinusMarker"),
            p: {width: "+= 4rem"},
            o: {duration: animationTime, display: 'inline-block', sequenceQueue: false}
        })
}

function highlight(line, type) {
    switch (type) {
        case 0:
            loadingSequence.push(lines[line][0]);
            break;
        case 1:
            loadingSequence.push(lines[line][1]);
            break;
        case 2:
            loadingSequence.push(lines[line][0], lines[line][1]);
            break;
    }
}

function forLoopAnimation(val, part) {
    if (part === 0) {
        loadingSequence.push({e: $("#nMinusMarker"), p: {boxShadowSpread: 3}, o: {duration: animationTime/2}});
        loadingSequence.push({e: $("#plusMark"), p: {opacity: 1}, o: {duration: animationTime, sequenceQueue: false}});
        loadingSequence.push({e: $("#nMinusMarker"), p: {boxShadowSpread: 0}, o: {duration: animationTime/2}});
        loadingSequence.push({e: $("#plusMark"), p: {opacity: 0}, o: {duration: animationTime, sequenceQueue: false}});
        $("#fibonacci").append('<div class="fibonacci-entry" style="opacity: 0; display:none"><h4 class="fibonacci-value noselect">' + val + '</h4></div>');
        loadingSequence.push({
            e: $("#fibonacci").children().last(),
            p: {opacity: 1},
            o: {duration: animationTime, display: 'inline-block', sequenceQueue: false}
        });

    }
    else if (part === 1) {
        loadingSequence.push({
            e: $("#nMinusMarker"),
            p: {width: "-= 4rem", left: "+= 4rem"},
            o: {duration: animationTime}
        });
    }
    else if (part === 2) {
        loadingSequence.push({e: $("#nMinusMarker"), p: {width: "+= 4rem"}, o: {duration: animationTime}});
    }
}

function markResult() {
    var result = $("#fibonacci").children().last();
    loadingSequence.push({e: result, p: "callout.swing", o: {duration: animationTime}});
    loadingSequence.push({e: $("#fibonacci").children().first(), p: {opacity: 0}, o: {duration: animationTime/2, sequenceQueue: false}});
    loadingSequence.push({
        e: result.children().first(),
        p: {color: "#008b00", fontSize: "3rem"},
        o: {duration: animationTime, sequenceQueue: false}
    })
}

function animate() {
    $.Velocity.RunSequence(loadingSequence);
}

