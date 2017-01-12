// ONLY works for numbers
function countingSort(array, maxValue) {
    if (array.constructor !== Array || array.length == 0)
        return [];

    var valueCount = Array.apply(null, Array(maxValue)).map(Number.prototype.valueOf, 0);
    var value;

    for (var i = 0; i < array.length; i++) {
        value = array[i];
        valueCount[value] += 1;
    }

    var result = new Array(array.list);
    var index = 0;
    for (var i = 0; i < valueCount.length; i++) {
        for (var j = 0; j < valueCount[i]; j++) {
            result[index] = i;
            index++;
        }
    }

    return result;
}