// QuickSort with median-of-three partitioning and cutoff for small arrays
var size = 0;
//var commands = [];

function QuickSort(arr) {
    this.a = arr;
    this.medianOfThree = false;
    //commands = [];
    size = arr.length;
}

QuickSort.prototype.sort = function() {
    this.quickSort(0, this.a.length - 1);

    //commands.push("merge()");
    merge();
    console.log(this.a);
    return this.a;
};

QuickSort.prototype.quickSort = function(low, high) {
    if(low < high) {
        if(high - low < 4) {
            //console.log("low: " + low + ", high: " + high);
            this.a = useInsertionSort(this.a, low, high+1);
            //console.log(this.a);
        } else {

            if(this.medianOfThree == true) {
                var middle = Math.floor(parseInt(low + high) / 2);
                if (this.a[middle] < this.a[low]) {
                    this.a = swapReferences(this.a, low, middle);
                    //commands.push("swap(" + low + ", " + middle + ");");
                    swap(low, middle);
                }
                if (this.a[high] < this.a[low]) {
                    this.a = swapReferences(this.a, low, high);
                    //commands.push("swap(" + low + ", " + high + ");")
                    swap(low, high);
                }
                if (this.a[high] < this.a[middle]) {
                    this.a = swapReferences(this.a, middle, high);
                    //commands.push("swap(" + middle + ", " + high + ");");
                    swap(middle, high);
                }
                this.a = swapReferences(this.a, middle, high - 1);
                //commands.push("swap(" + middle + ", " + (high - 1) + ");");
                swap(middle, high-1);
            }

            var p = this.partition(low, high);
            //commands.push("colorPartition(" + low + ", " + p + ", 'left')");
            colorPartition(low, p, 'left');
            this.quickSort(low, p);
            //commands.push("colorPartition(" + (p+1) + ", " + high + ", 'right')");
            colorPartition(p+1, high, 'right');
            this.quickSort(p + 1, high);
        }
    }
};

QuickSort.prototype.partition = function(low, high) {
    var pivot = this.a[high-1];
    //commands.push("highlightPivot(" + low + ")");
    //commands.push("markPivot(" + (low) + ", 'left');" );
    //commands.push("markPivot(" + (high) + ", 'right');");
    highlightPivot(low);
    markPivot(low, 'left');
    markPivot(high, 'right');

        var i, j;
        for (i = low - 1, j = high + 1; ;) {
            while (/*commands.push("markPivot(" + (i+1) + ", 'left');")*/ markPivot(i+1, 'left') && this.a[++i] < pivot) {
            }
            while (/*commands.push("markPivot(" + (j-1) + ", 'right');")*/ markPivot(j-1, 'right') && pivot < this.a[--j] ) {
            }
            if (i >= j)
                return j;
            this.a = swapReferences(this.a, i, j);
            //commands.push("swap(" + i + " ," + j + ");");
            swap(i, j);
        }
};

function swapReferences(a, i, j ) {
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
    return a;
}

function useInsertionSort(a, low, high) {
    for(var p = low + 1; p < high; p++) {
        var tmp = a[p];
        var j = p;

        for(; j > low && highlight(j, j-1) && tmp < a[j - 1]; j--) {
            a[j] = a[j - 1];
            console.log(j);

            swap(j, j-1);
            clearAllHighlight();
        }
        a[j] = tmp;
        clearAllHighlight();
    }

    return a;
}
