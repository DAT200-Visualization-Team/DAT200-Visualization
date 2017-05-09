function bubbleSort(array) {
    var n = array.length;
    while(n > 0) {
        var newN = 0;
        for (var i = 1; i < n; i++) {
            if (array[i - 1] > array[i]) {
                var tmp = array[i];
                array[i] = array[i - 1];
                array[i - 1] = tmp;
                swap(i, i-1);
                newN = i;
            }
        }
        n = newN;
        //markAsSorted(newN);
    }

    return array;
}
