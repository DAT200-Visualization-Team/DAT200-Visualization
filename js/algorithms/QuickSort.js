// QuickSort with median-of-three partitioning and cutoff for small arrays
var size = 0;

function QuickSort(arr) {
    this.a = arr;
    size = arr.length;
}

QuickSort.prototype.sort = function (medianOfThree) {
    if (medianOfThree)
        this.quickSortMedian3(0, this.a.length - 1);
    else
        this.quickSortLeftPivot(0, this.a.length - 1);

    merge();
    return this.a;
};

QuickSort.prototype.quickSortLeftPivot = function (low, high) {
    highlightCode([0]);
    if (low < high) {
        highlightCode([1]);
        if (high - low < 4) {
            highlightCode([2]);
            this.a = useInsertionSort(this.a, low, high + 1);
        }
        else {
            highlightCode([4, 5], 'quickSortLeftPivot');
            var p = this.partition(low, high);
            colorPartition(low, p, 'left');
            highlightCode([6], 'quickSortLeftPivot');
            this.quickSortLeftPivot(low, p);
            colorPartition(p + 1, high, 'right');
            highlightCode([7], 'quickSortLeftPivot');
            this.quickSortLeftPivot(p + 1, high);
        }
    }
};

QuickSort.prototype.quickSortMedian3 = function (low, high) {
    highlightCode([0], 'quickSortMedianOfThree');
    if (low < high) {
        highlightCode([1]);
        if (high - low < 4) {
            highlightCode([2]);
            this.a = useInsertionSort(this.a, low, high + 1);
        }
        else {
            highlightCode([4, 5, 6], 'quickSortMedianOfThree');
            var middle = Math.floor(parseInt(low + high) / 2);

            if (this.a[middle] < this.a[low]) {
                this.a = swapReferences(this.a, low, middle);
                swap(low, middle,7);
            }
            highlightCode([9]);
            if (this.a[high] < this.a[low]) {
                this.a = swapReferences(this.a, low, high);
                swap(low, high, 10);
            }
            highlightCode([12]);
            if (this.a[high] < this.a[middle]) {
                this.a = swapReferences(this.a, middle, high);
                swap(middle, high, 13);
            }
            this.a = swapReferences(this.a, middle, high - 1);
            swap(middle, high - 1, 15);

            highlightCode([17]);
            var p = this.partition(low, high);
            colorPartition(low, p, 'left');
            highlightCode([18], 'quickSortMedianOfThree');
            this.quickSortMedian3(low, p);
            colorPartition(p + 1, high, 'right');
            highlightCode([19], 'quickSortMedianOfThree');
            this.quickSortMedian3(p + 1, high);
        }
    }
};

QuickSort.prototype.partition = function (low, high) {
    highlightCode([0,2,3], 'partition');
    var pivot = this.a[high - 1];

    highlightPivot(low);
    markPivot(low, 'left');
    markPivot(high, 'right');

    var i, j;
    for (i = low - 1, j = high + 1; ;) {
        while (markPivot(i + 1, 'left', 4) && this.a[++i] < pivot) { }
        while (markPivot(j - 1, 'right', 6) && pivot < this.a[--j]) { }
        highlightCode([8]);
        if (i >= j) {
            highlightCode([9]);
            return j;
        }
        this.a = swapReferences(this.a, i, j);
        swap(i, j, 11);
        highlightCode([3]);
    }
};

function swapReferences(a, i, j) {
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
    return a;
}

function useInsertionSort(a, low, high) {
    highlightCode([0], 'insertionSort');
    for (var p = low + 1; p < high; p++) {
        var tmp = a[p];
        var j = p;
        highlightCode([1, 2]);

        for (; j > low && highlight(j, j - 1, null, null, 4) && tmp < a[j - 1]; j--) {
            a[j] = a[j - 1];

            swap(j, j - 1, 5);
            clearAllHighlight();
        }
        a[j] = tmp;
        highlightCode([7]);
        clearAllHighlight();
        highlightCode([0]);
    }
    highlightCode([11]);

    return a;
}
