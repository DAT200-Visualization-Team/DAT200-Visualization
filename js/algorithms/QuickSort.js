// QuickSort with median-of-three partitioning and cutoff for small arrays
var size = 0;

function QuickSort(arr) {
    this.a = arr;
    this.medianOfThree = false;
    size = arr.length;
}

QuickSort.prototype.sort = function () {
    this.quickSort(0, this.a.length - 1);

    merge();
    console.log(this.a);
    return this.a;
};

QuickSort.prototype.quickSortLeftPivot = function (low, high) {
    if (low < high) {
        if (high - low < 4) {
            this.a = useInsertionSort(this.a, low, high + 1);
        }

        var p = this.partition(low, high);
        colorPartition(low, p, 'left');
        this.quickSort(low, p);
        colorPartition(p + 1, high, 'right');
        this.quickSort(p + 1, high);
    }
};

QuickSort.prototype.quickSortMedian3 = function (low, high) {
    if (low < high) {
        if (high - low < 4) {
            this.a = useInsertionSort(this.a, low, high + 1);
        } else {

            if (this.medianOfThree == true) {
                var middle = Math.floor(parseInt(low + high) / 2);
                if (this.a[middle] < this.a[low]) {
                    this.a = swapReferences(this.a, low, middle);
                    swap(low, middle);
                }
                if (this.a[high] < this.a[low]) {
                    this.a = swapReferences(this.a, low, high);
                    swap(low, high);
                }
                if (this.a[high] < this.a[middle]) {
                    this.a = swapReferences(this.a, middle, high);
                    swap(middle, high);
                }
                this.a = swapReferences(this.a, middle, high - 1);
                swap(middle, high - 1);
            }

            var p = this.partition(low, high);
            colorPartition(low, p, 'left');
            this.quickSort(low, p);
            colorPartition(p + 1, high, 'right');
            this.quickSort(p + 1, high);
        }
    }
};

QuickSort.prototype.partition = function (low, high) {
    var pivot = this.a[high - 1];

    highlightPivot(low);
    markPivot(low, 'left');
    markPivot(high, 'right');

    var i, j;
    for (i = low - 1, j = high + 1; ;) {
        while (markPivot(i + 1, 'left') && this.a[++i] < pivot) {
        }
        while (markPivot(j - 1, 'right') && pivot < this.a[--j]) {
        }
        if (i >= j)
            return j;
        this.a = swapReferences(this.a, i, j);
        swap(i, j);
    }
};

function swapReferences(a, i, j) {
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
    return a;
}

function useInsertionSort(a, low, high) {
    for (var p = low + 1; p < high; p++) {
        var tmp = a[p];
        var j = p;

        for (; j > low && highlight(j, j - 1) && tmp < a[j - 1]; j--) {
            a[j] = a[j - 1];

            swap(j, j - 1);
            clearAllHighlight();
        }
        a[j] = tmp;
        clearAllHighlight();
    }

    return a;
}
