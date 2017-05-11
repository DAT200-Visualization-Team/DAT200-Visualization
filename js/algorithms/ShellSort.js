function shellSort(a) {
    highlightCode([1]);
    for(var gap = parseInt(a.length / 2); gap > 0;
        gap = gap === 2 ? 1 : parseInt(gap / 2.2)) {
        sublist(gap);

        highlightCode([4]);
        for(var i = gap; i < a.length; i++) {
            var tmp = a[i];
            highlightCode([5, 6]);

            for(var j = i; j >= gap && highlight(j, j-gap, null, null, 7) && tmp < a[j - gap]; j-= gap) {
                a[j] = a[j - gap];
                swap(j-gap, j, 8);
                clearAllHighlight();
            }
            clearAllHighlight();
            a[j] = tmp;
        }
        mergeSublists();
        highlightCode([1]);
    }

    highlightCode([15]);
    return a;
}