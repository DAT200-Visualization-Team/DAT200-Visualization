// QuickSort with median-of-three partitioning and cutoff for small arrays
var size = 0;
var commands = [];

function QuickSort(arr) {
    this.a = arr;
    commands = [];
    size = arr.length;
}

QuickSort.prototype.sort = function() {
    this.quickSort(0, this.a.length - 1);

    return this.a;
};

QuickSort.prototype.quickSort = function(low, high) {
    if(low < high) {
        var p = this.partition(low, high);
       //commands.push("console.log('pivot: " + p + "')" );
        //commands.push("console.log('split from: " + low + ", to: " + p + " ')" );
        commands.push("colorPartition(" + low + ", " + p + ")");
        this.quickSort(low, p);
        //commands.push("console.log('split from: " + (p+1) + ", to: " + high + " ')" );
        commands.push("colorPartition(" + (p+1) + ", " + high + ")");
        this.quickSort(p + 1, high);

    }
};

QuickSort.prototype.partition = function(low, high) {
    var pivot = this.a[low];
    commands.push("markPivot(" + (low) + ", 'left');" );
    var i, j;
    for (i = low - 1, j = high + 1; ;) {
        while (this.a[++i] < pivot /*&& commands.push("markPivot(" + (i) + ", 'left');" )*/) {
        }
        while (pivot < this.a[--j] /*&& commands.push("markPivot(" + (j) + ", 'right');")*/) {
        }
        if (i >= j)
            return j;
        this.a = swapReferences(this.a, i, j);
        commands.push("swap(" + i + " ," + j + ");");
    }
    //this.a = swapReferences(this.a, i, high - 1);
    //commands.push("swap(" + i + ", " + (high-1) + ");");

   // return i + 1;
};

function swapReferences(a, i, j ) {
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
    return a;
}
