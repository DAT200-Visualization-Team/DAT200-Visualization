var animationTime = 1;
var arr;
var codeDisplayManager;

function setArray(array) {
    codeDisplayManager = new CodeDisplayManager("javascript", "arraySearch");
    if (array == null) arr = [5, 18, 2, 3, 82, 9, 1, 4, 7];
    else arr = array;

    $("#arraySearch").empty();
    for (var i = 0; i < arr.length; i++) {
        $("#arraySearch").append('<div class="entry"><h4 class="entry-value noselect">' + arr[i] + '</h4></div>');
    }
}

function visualizeLinearSearch(search) {
    clear();
    codeDisplayManager.loadFunctions("linearSearch");
    codeDisplayManager.changeFunction("linearSearch");
    codeDisplayManager.setVariable("i", "0");
    codeDisplayManager.setVariable("array", "[" + arr.join() + "]");
    codeDisplayManager.setVariable("search", search);

    for (var i = 0; i < arr.length; i++) {
		appendCodeLines([0], codeDisplayManager);
		updateVariable("i", i.toString());

        var tmp = {
            e: $("#arraySearch").children().eq(i),
            p: {backgroundColor: "#FFFF00"},
            o: {duration: animationTime}
        };
        appendAnimation(1, [tmp], codeDisplayManager);

        if (arr[i] === search) {
            var tmp = {
                e: $("#arraySearch").children().eq(i),
                p: {backgroundColor: "#00FF00"},
                o: {duration: animationTime}
            };
            appendAnimation(2, [tmp], codeDisplayManager);
            return i;
        }

        var tmp = {
            e: $("#arraySearch").children().eq(i),
            p: {backgroundColor: "#CC6C6C"},
            o: {duration: animationTime}
        };
        appendAnimation(3, [tmp], codeDisplayManager);
    }
    var tmp = {e: $("#arraySearch").children(), p: {backgroundColor: "#FF0000"}, o: {duration: animationTime}};
    appendAnimation(4, [tmp], codeDisplayManager);
}

function visualizeBinarySearch(search) {
    var sortedArray = arr;
    function compareNumbers(a, b) {
        return a - b;
    }
    arr = arr.sort(compareNumbers);
    clear();
    codeDisplayManager.loadFunctions("binarySearch");
    codeDisplayManager.changeFunction("binarySearch");
	codeDisplayManager.setVariable("search", search);
	codeDisplayManager.setVariable("sortedArray", "[" + arr.join() + "]");
    createDivsForArrows(arr.length);
    binSearch(search, arr);

    function binSearch(search, sortedArray) {
		var testIndex = Math.floor(sortedArray.length / 2);
		codeDisplayManager.setVariable("testIndex", testIndex.toString());
        var tmp = {e: $("#testIndex"), p: {opacity: 1}, o: {duration: animationTime}};
        appendAnimation(0, [tmp], codeDisplayManager);

		var max = sortedArray.length - 1;
		codeDisplayManager.setVariable("max", max.toString());
        var tmp = {e: $("#max"), p: {opacity: 1}, o: {duration: animationTime}};
        appendAnimation(1, [tmp], codeDisplayManager);

        var min = 0;
		var tmp = { e: $("#min"), p: { opacity: 1 }, o: { duration: animationTime } };
		codeDisplayManager.setVariable("min", min.toString());
        appendAnimation(2, [tmp], codeDisplayManager);

        appendCodeLines([4], codeDisplayManager);
        if (search > sortedArray[max]) {
            var tmp = {e: $("#arraySearch").children(), p: {backgroundColor: "#FF0000"}, o: {duration: animationTime}};
            appendAnimation(5, [tmp], codeDisplayManager);
            return -1;
        }

        appendCodeLines([6], codeDisplayManager);
        if (search < sortedArray[min]) {
            var tmp = {e: $("#arraySearch").children(), p: {backgroundColor: "#FF0000"}, o: {duration: animationTime}};
            appendAnimation(7, [tmp], codeDisplayManager);
            return -1;
        }

        appendCodeLines([9], codeDisplayManager);
        while (true) {
            var hasBeenInIfBefore = false;
            appendCodeLines([10], codeDisplayManager);
            if (sortedArray[testIndex] > search) {
                hasBeenInIfBefore = true;
				max = testIndex;
				updateVariable("max", max.toString());
                var tmp = {e: $("#max"), p: {left: moveArrowToIdx("max", max)}, o: {duration: animationTime}};
                appendAnimation(11, [tmp], codeDisplayManager);
            }

            appendCodeLines([12], codeDisplayManager);
            if (sortedArray[testIndex] === search && !hasBeenInIfBefore) {
                hasBeenInIfBefore = true;
                var tmp = {
                    e: $("#arraySearch").children().eq(testIndex),
                    p: {backgroundColor: "#00FF00"},
                    o: {duration: animationTime}
                };
                appendAnimation(13, [tmp], codeDisplayManager);
                return testIndex;
            }
            appendCodeLines([14], codeDisplayManager);
            if(!hasBeenInIfBefore) {
                hasBeenInIfBefore = true;
				min = testIndex;
				updateVariable("min", min.toString());
                var tmp = {e: $("#min"), p: {left: moveArrowToIdx("min", min)}, o: {duration: animationTime}};
                appendAnimation(15, [tmp], codeDisplayManager);
            }

			testIndex = Math.floor((max + min) / 2);
			updateVariable("testIndex", testIndex.toString());
            var tmp = {e: $("#testIndex"), p: {left: moveArrowToIdx("testIndex", testIndex)}, o: {duration: animationTime}};
            appendAnimation(17, [tmp], codeDisplayManager);

            appendCodeLines([19], codeDisplayManager);
            if (max - min <= 1) {
                appendCodeLines([20], codeDisplayManager);
                if (sortedArray[max] === search) {
                    var tmp = {
                        e: $("#arraySearch").children().eq(max),
                        p: {backgroundColor: "#00FF00"},
                        o: {duration: animationTime}
                    };
                    appendAnimation(21, [tmp], codeDisplayManager);
                    return max;
                }
                appendCodeLines([22], codeDisplayManager);
                if (sortedArray[min] === search) {
                    var tmp = {
                        e: $("#arraySearch").children().eq(min),
                        p: {backgroundColor: "#00FF00"},
                        o: {duration: animationTime}
                    };
                    appendAnimation(23, [tmp], codeDisplayManager);
                    return min;
                }
                var tmp = {e: $("#arraySearch").children(), p: {backgroundColor: "#FF0000"}, o: {duration: animationTime}};
                appendAnimation(25, [tmp], codeDisplayManager);
                return -1;
            }
            appendCodeLines([26, 9], codeDisplayManager);

        }
    }

    function createDivsForArrows(arrLength) {
        $("#arraySearch-wrapper").prepend('<div id="testIndex-wrapper"><div class="arrow-down" id="testIndex"></div></div>');
        $("#arraySearch-wrapper").append('<div id="minMax-wrapper"><div class="arrow-up" id="min"></div><div class="arrow-up" id="max"></div></div>');


        $("#min").css("left", moveArrowToIdx("min", 0)).css("opacity", 0);
        $("#max").css("left", moveArrowToIdx("max", arr.length - 1)).css("opacity", 0);
        $("#testIndex").css("left", moveArrowToIdx("testIndex", Math.floor(arr.length / 2))).css("opacity", 0);
    }

    function moveArrowToIdx(arrow, idx) {
        var a;
        if(arrow == "testIndex") a = $("#testIndex");
        else if(arrow == "min") a = $("#min");
        else if(arrow == "max") a = $("#max");

        var element = $("#arraySearch").children().eq(idx).get(0);
        var position = element.getBoundingClientRect().left;
        return position + 32 - 15; //+half of box -padding
    }
}

function clear() {
    $("#testIndex-wrapper").remove();
    $("#minMax-wrapper").remove();
    setArray(arr);
}

setArray();