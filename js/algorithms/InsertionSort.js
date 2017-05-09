function insertionSort(a) {

    for(var p = 1; p < a.length; p++) {
        var tmp = a[p];
        var j = p;

        for(; j > 0 && highlight(j, j-1) && tmp < a[j - 1]; j--) {
            a[j] = a[j - 1];

            swap(j, j-1);
            clearAllHighlight();
        }
        a[j] = tmp;
        clearAllHighlight();
    }

    return a;
}
