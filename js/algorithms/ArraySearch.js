function linearSearch(array, search) {
    for (var i = 0; i < array.length; i++)
        if (array[i] === search) return i;
    
    return false;
}

function binarySearch(sortedArray, search) {
    var testIndex = sortedArray.length / 2;
    var max = sortedArray.length - 1;
    var min = 0;

    if (search > sortedArray[max]) return -1;
    if (search < sortedArray[min]) return -1;
    while (true) {
        if (sortedArray[testIndex] > search)
            max = testIndex;
        else if (sortedArray[testIndex] === search)
            return testIndex;
        else
            min = testIndex;

        testIndex = (max + min) / 2;
        
        if (max - min <= 1) {
            if (sortedArray[max] === search) return max;
            if (sortedArray[min] === search) return min;
            return -1;
        }
    }
}