var codeDisplayManager = new CodeDisplayManager("javascript", "fibonacci");
var animationTime = 1;


function runIterativeFib(n) {
    $("#fibonacci").empty();

    codeDisplayManager.loadFunctions("iterativeFib");
    codeDisplayManager.changeFunction("iterativeFib");

    iterativeFib(n);
}

function runNaiveFib(n) {
    $("#fibonacci").empty();

    codeDisplayManager.loadFunctions("naiveFib");
    codeDisplayManager.changeFunction("naiveFib");

    $("#fibonacci").append('<h4 class="fibonacci-value noselect" style="font-size: 16px">' +
        'There is no animation for this algorithm yet,<br /> just code highlighting.</h4>');

    if(n < 17)
        naiveFib(n);
    else if(n > 16) {
        if (confirm("This input will potentially make your browser slow and/or crash it. Do you want to continue?") == true)
            naiveFib(n);
    }

}

function iterativeFib(n) {
    //TODO: make it so that the visualization handles n == 1 or 2
    if(n < 3) return;
    codeDisplayManager.setVariable("n", n.toString());
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
    updateVariable("nMinusTwo", nMinusTwo.toString());

    var nMinusOne = 1;
    appendAnimation(6, fadeInAndMark("nMinusOne", 1), codeDisplayManager);
    updateVariable("nMinusOne", nMinusOne.toString());


    appendCodeLines([7], codeDisplayManager);
    var result = 0;
    updateVariable("result", result.toString());

    for (var i = 3; i <= n; i++) {
        appendCodeLines([9], codeDisplayManager);
        updateVariable("i", i.toString());
        result = nMinusOne + nMinusTwo;
        appendAnimation(10, forLoopAnimation(result, 0), codeDisplayManager);
        updateVariable("result", result.toString());

        nMinusTwo = nMinusOne;
        appendAnimation(11, forLoopAnimation(result, 1), codeDisplayManager);
        updateVariable("nMinusTwo", nMinusTwo.toString());

        nMinusOne = result;
        appendAnimation(12, forLoopAnimation(result, 2), codeDisplayManager);
        updateVariable("nMinusOne", nMinusOne);


        appendCodeLines([13], codeDisplayManager);
    }

    appendAnimation(15, markResult(), codeDisplayManager);

    appendCodeLines([16], codeDisplayManager);
}

function naiveFib(n) {
    updateVariable("n", n.toString());
    appendCodeLines([0], codeDisplayManager);
    if (n < 1) {
        appendCodeLines([1], codeDisplayManager);
        throw new {name: "IllegalArgumentException", message: "The Fibonacci numbers start at 1."};
    }
    appendCodeLines([2], codeDisplayManager);
    if (n === 1) {
        appendCodeLines([3], codeDisplayManager);
        return 1;
    }
    appendCodeLines([4], codeDisplayManager);
    if (n === 2) {
        appendCodeLines([5], codeDisplayManager);
        return 1;
    }

    appendCodeLines([7], codeDisplayManager);
    var tmp =  naiveFib(n - 1) + naiveFib(n - 2);
    appendCodeLines([7], codeDisplayManager);
    return;
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
            p: {width: "+=4rem"},
            o: {duration: animationTime, display: 'inline-block', position: "-=" + animationTime}
        });
    return arr;
}

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
            p: {opacity: 1, display: 'inline-block'},
            o: {duration: animationTime, position: "-=" + animationTime}
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

function markResult() {
    var arr = [];
    var result = $("#fibonacci").children().last();
    arr.push({e: $("#fibonacci").children().first(), p: {opacity: 0}, o: {duration: animationTime/2, sequenceQueue: false}});
    arr.push({
        e: result.children().first(),
        p: {color: "#008b00", fontSize: "3rem", ease: Bounce.easeOut},
        o: {duration: animationTime, position: "-=" + animationTime}
    });

    return arr;
}