function bubbleSort(array) {
    var n = array.length;
    while(n > 0) {
        newN = 0;
        for (var i = 1; i < n - 1; i++) {
            if (array[i - 1] > array[i]) {
                var tmp = array[i];
                array[i] = array[i - 1];
                array[i - 1] = tmp;
                newN = i;
            }
        }
        n = newN;
    }

    return array;
}