function maximumSubsequenceSum(array) {
    var currentMaximum, greatestMaximum;
    currentMaximum = greatestMaximum = array[0];

    for (var i = 1; i < array.length; i++) {
        currentMaximum = Math.max(array[i], currentMaximum + array[i]);
        greatestMaximum = Math.max(currentMaximum, greatestMaximum);
    }

    return greatestMaximum;
}