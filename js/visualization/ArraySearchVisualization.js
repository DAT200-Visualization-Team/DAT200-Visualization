var animationTime = 1;
var arr;
var tl;

function setArray(array) {
    tl = new TimelineMax();
    if(array == null) arr = [5,18,2,3,82,9,1,4,7];
    else arr = array;

    $("#arraySearch").empty();
    for(var i = 0; i < arr.length; i++) {
        $("#arraySearch").append('<div class="entry"><h4 class="entry-value noselect">' + arr[i] + '</h4></div>');
    }
}

function visualizeLinearSearch(search) {
    for (var i = 0; i < arr.length; i++) {
        if(i != 0) {
            tl.to($("#arraySearch").children().eq(i - 1), animationTime, {backgroundColor: "#cc6c6c"});
            tl.to($("#arraySearch").children().eq(i), animationTime, {backgroundColor: "#FFFF00"}, "-=" + animationTime);
        } else
            tl.to($("#arraySearch").children().eq(i), animationTime, {backgroundColor: "#FFFF00"});
        if (arr[i] === search) {
            tl.to($("#arraySearch").children().eq(i), animationTime, {backgroundColor: "green"});
            return i;
        }
    }
    tl.to($("#arraySearch").children(), animationTime, {backgroundColor: "red"});
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

function animate() {
    tl.play();
}