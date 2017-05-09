// ONLY works for numbers
function countingSort(array, maxValue) {
    highlightCode([0]);

    if (array.constructor !== Array || array.length == 0) {
        highlightCode([1]);
        return [];
    }

    highlightCode([3, 4, 6]);

    var valueCount = Array.apply(null, Array(maxValue)).map(Number.prototype.valueOf, 0);
    var value;
    for (var i = 0; i < array.length; i++) {
        value = array[i];

        highlight(i, "#unsortedArray");

        valueCount[value] += 1;

        countUpdate(value);
        clearHighlight("#countingArray");
    }

    highlightCode([11,12,13]);
    var result = new Array(array.list);
    var index = 0;
    for (var i = 0; i < valueCount.length; i++) {
        highlightCode([14]);
        for (var j = 0; j < valueCount[i]; j++) {
            result[index] = i;
            sortedUpdate(index, i);
            index++;
        }
        highlightCode([13]);
    }

    highlightCode([20]);
    return result;
}
