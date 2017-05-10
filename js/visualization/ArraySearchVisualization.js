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
    codeDisplayManager.loadFunctions("linearSearch");
    codeDisplayManager.changeFunction("linearSearch");

    for (var i = 0; i < arr.length; i++) {
        appendCodeLines([0], codeDisplayManager);

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
    setArray(arr);
    codeDisplayManager.loadFunctions("binarySearch");
    codeDisplayManager.changeFunction("binarySearch");
    binSearch(search, arr);

    function binSearch(search, sortedArray) {
        appendCodeLines([0, 1, 2], codeDisplayManager);
        var testIndex = Math.floor(sortedArray.length / 2);
        //TODO: sett testindex-variabelen

        var max = sortedArray.length - 1;
        //TODO: sett max-variabelen

        var min = 0;
        //TODO: sett min-variabelen

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
                appendCodeLines([11], codeDisplayManager);
                max = testIndex;
                //TODO: sett max-variabelen
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
                appendCodeLines([15], codeDisplayManager);
                min = testIndex;
                //TODO: sett min-variabelen
            }

            appendCodeLines([17], codeDisplayManager);
            testIndex = Math.floor((max + min) / 2);
            //TODO: sett testindex-variabelen

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

    /*function createDivsForArrows() {
    $("#arraySearch-wrapper").append('<div></div>')
    }*/
}

setArray();