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
        if (i != 0) {
            var tmp = [];
            tmp.push({
                e: $("#arraySearch").children().eq(i - 1),
                p: {backgroundColor: "#cc6c6c"},
                o: {duration: animationTime}
            });
            tmp.push({
                e: $("#arraySearch").children().eq(i),
                p: {backgroundColor: "#FFFF00"},
                o: {duration: animationTime}
            });
            appendAnimation(0, tmp, codeDisplayManager);

        } else {
            var tmp = {
                e: $("#arraySearch").children().eq(i),
                p: {backgroundColor: "#FFFF00"},
                o: {duration: animationTime}
            };
            appendAnimation(0, tmp, codeDisplayManager);
        }
        if (arr[i] === search) {
            var tmp = {
                e: $("#arraySearch").children().eq(i),
                p: {backgroundColor: "#FFFF00"},
                o: {duration: animationTime}
            };
            appendAnimation(2, tmp, codeDisplayManager);
            return i;
        }
        appendCodeLines(3, codeDisplayManager);
    }
    var tmp = {e: $("#arraySearch").children(), p: {backgroundColor: "red"}, o: {duration: animationTime}};
    appendAnimation(4, tmp);
    return -1;
}

function visualizeBinarySearch(sortedArray, search) {
    var testIndex = Math.floor(sortedArray.length / 2);
    var max = sortedArray.length - 1;
    var min = 0;

    if (search > sortedArray[max]) return -1;
    if (search < sortedArray[min]) return -1;
    while (true) {
        if (sortedArray[testIndex] > search) {
            max = testIndex;
        }
        else if (sortedArray[testIndex] === search) {
            return testIndex;
        }
        else {
            min = testIndex;
        }

        testIndex = Math.floor((max + min) / 2);

        if (max - min <= 1) {
            if (sortedArray[max] === search) return max;
            if (sortedArray[min] === search) return min;
            return -1;
        }
    }
}
