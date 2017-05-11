function bubbleSort(array) {
    var n = array.length;
    highlightCode([0, 1])
    while (n > 0) {
        highlightCode([2, 3]);
        var newN = 0;
        for (var i = 1; i < n; i++) {
            highlight(i - 1, i);
            highlightCode([4]);
            if (array[i - 1] > array[i]) {
                highlightCode([5,6]);
                var tmp = array[i];
                array[i] = array[i - 1];
                array[i - 1] = tmp;
                swap(i, i - 1, 7);
                highlightCode([8]);
                newN = i;
            }
            clearHighlight(i-1);
        }
        n = newN;
        highlightCode([11]);
        markAsSorted(newN);
        highlightCode([1]);
    }

    highlightCode([14]);
    return array;
}
