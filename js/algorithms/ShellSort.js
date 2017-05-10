// Shell sort

function shellSort(a) {

    for(var gap = a.length / 2; gap > 0;
        gap = gap === 2 ? 1 : parseInt(gap / 2.2)) {
        sublist(gap);

        for(var i = gap; i < a.length; i++) {
            var tmp = a[i];

            for(var j = i; j >= gap && highlight(i, j-gap) && tmp < a[j - gap]; j-= gap) {
                a[j] = a[j - gap];
                swap(j-gap, j);
                clearAllHighlight();
            }
            clearAllHighlight();
            a[j] = tmp;
        }
        mergeSublists();
    }

    return a;
}