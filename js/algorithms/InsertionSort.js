function insertionSort(a) {
    highlightCode([0]);
    for(var p = 1; p < a.length; p++) {
        var tmp = a[p];
        var j = p;
        highlightCode([1,2]);
        for(; j > 0 && highlight(j, j-1, null, null, 4) && tmp < a[j - 1]; j--) {
            a[j] = a[j - 1];

            swap(j, j-1, 5);
            clearAllHighlight();
        }
        a[j] = tmp;
        highlightCode([8]);
        clearAllHighlight();
        highlightCode([0]);
    }

    highlightCode([11]);
    return a;
}
