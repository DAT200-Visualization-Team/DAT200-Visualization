// QuickSort with median-of-three partitioning and cutoff for small arrays

function QuickSort(arr) {
    this.a = arr;
}

QuickSort.prototype.sort = function() {
    this.quickSort(0, this.a.length - 1);
    return this.a;
};

QuickSort.prototype.quickSort = function(low, high) {
    if(low + 3 > high) {
        this.a = insertionSort(this.a);
    }
    else {
        var middle = Math.floor(parseInt(low + high) / 2);
        if (this.a[middle] < this.a[low]) {
            this.a = swapReferences(this.a, low, middle);
        }
        if (this.a[high] < this.a[low]) {
            this.a = swapReferences(this.a, low, high);
        }
        if (this.a[high] < this.a[middle]) {
            this.a = swapReferences(this.a, middle, high);
        }

        this.a = swapReferences(this.a, middle, high - 1);
        var pivot = this.a[high - 1];

        var i, j;
        for (i = low, j = high - 1; ;) {
            while (this.a[++i] < pivot) {
            }
            while (pivot < this.a[--j]) {
            }
            if (i >= j)
                break;
            this.a = swapReferences(this.a, i, j);
        }
        this.a = swapReferences(this.a, i, high - 1);

        this.quickSort(low, i - 1);
        this.quickSort(i + 1, high);
    }
};

function swapReferences(a, i, j ) {
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
    return a;
}
