var codeDisplayManager = new CodeDisplayManager("javascript", "fibonacci");
var animationTime = 1;


function runIterativeFib(n) {
    $("#fibonacci").empty();

    codeDisplayManager.loadFunctions("iterativeFib");
    codeDisplayManager.changeFunction("iterativeFib");

    iterativeFib(n);
}

function iterativeFib(n) {
    appendCodeLines([0], codeDisplayManager);
    if (n <= 0) {
        appendCodeLines([1], codeDisplayManager);
        throw new {name: "IllegalArgumentException", message: "The Fibonacci numbers start at 1."};
    }
    appendCodeLines([2], codeDisplayManager);
    if (n === 1) {
        return 1;
    }
    appendCodeLines([3], codeDisplayManager);
    if (n === 2) {
        return 1;
    }

    initialize();


    var nMinusTwo = 1;
    appendAnimation(5, fadeInAndMark("nMinusTwo", 0), codeDisplayManager);

    var nMinusOne = 1;
    appendAnimation(6, fadeInAndMark("nMinusOne", 1), codeDisplayManager);


    appendCodeLines([7], codeDisplayManager);
    var result = 0;

    for (var i = 3; i <= n; i++) {
        appendCodeLines([9], codeDisplayManager);


        result = nMinusOne + nMinusTwo;
        appendAnimation(10, forLoopAnimation(result, 0), codeDisplayManager);

        nMinusTwo = nMinusOne;
        appendAnimation(11, forLoopAnimation(result, 1), codeDisplayManager);

        nMinusOne = result;
        appendAnimation(12, forLoopAnimation(result, 2), codeDisplayManager);


        appendCodeLines([13], codeDisplayManager);
    }

    appendAnimation(15, markResult(), codeDisplayManager)

    appendCodeLines([16], codeDisplayManager);

}

function initialize() {
    $("#fibonacci").append('<div id="nMinusMarker" style="opacity: 0; display: inline-flex;"><h4 id="plusMark" style="opacity: 0">+</h4></div>');
    $("#fibonacci").append('<div class="fibonacci-entry"><h4 class="fibonacci-value noselect" id="nMinusTwo" style="opacity: 0">1</h4></div>');
    $("#fibonacci").append('<div class="fibonacci-entry"><h4 class="fibonacci-value noselect" id="nMinusOne" style="opacity: 0">1</h4></div>');

}

function fadeInAndMark(id, part) {
    var arr = [];
    arr.push({e: $("#" + id), p: {opacity: 1}, o: {duration: animationTime, display: 'inline-block'}});
    if (part === 0)
        arr.push({
            e: $("#nMinusMarker"),
            p: {opacity: 1},
            o: {duration: animationTime, display: 'inline-block', position: "-=" + animationTime}
        });

    else if (part === 1)
        arr.push({
            e: $("#nMinusMarker"),
            p: {width: "+= 4rem"},
            o: {duration: animationTime, display: 'inline-block', position: "-=" + animationTime}
        });
    return arr;
}


//STATUS: DONE
// Returns an array of animation meant to be given to a method in animationPlayer.
function forLoopAnimation(val, part) {
    var arr = [];
    if (part === 0) {
        arr.push({e: "#nMinusMarker", p: {boxShadowSpread: 3}, o: {duration: animationTime/2}});
        arr.push({e: "#plusMark", p: {opacity: 1}, o: {duration: animationTime, position: "-=" + animationTime}});
        arr.push({e: "#nMinusMarker", p: {boxShadowSpread: 0}, o: {duration: animationTime/2}});
        arr.push({e: "#plusMark", p: {opacity: 0}, o: {duration: animationTime, position: "-=" + animationTime}});
        $("#fibonacci").append('<div class="fibonacci-entry" style="opacity: 0; display:none"><h4 class="fibonacci-value noselect">' + val + '</h4></div>');
        arr.push({
            e: $("#fibonacci").children().last(),
            p: {opacity: 1},
            o: {duration: animationTime, display: 'inline-block', sequenceQueue: false}
        });

    }
    else if (part === 1) {
        arr.push({
            e: $("#nMinusMarker"),
            p: {width: "-=4rem", left: "+=4rem"},
            o: {duration: animationTime}
        });
    }
    else if (part === 2) {
        arr.push({e: $("#nMinusMarker"), p: {width: "+=4rem"}, o: {duration: animationTime}});
    }

    return arr;
}

//STATUS: DONE
// Returns an array of animation meant to be given to a method in animationPlayer.
function markResult() {
    var arr = [];
    var result = $("#fibonacci").children().last();
    arr.push({e: result, p: "callout.swing", o: {duration: animationTime}});
    arr.push({e: $("#fibonacci").children().first(), p: {opacity: 0}, o: {duration: animationTime/2, sequenceQueue: false}});
    arr.push({
        e: result.children().first(),
        p: {color: "#008b00", fontSize: "3rem"},
        o: {duration: animationTime, position: "-=" + animationTime}
    });

    return arr;
}