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
    //if(this.a.length == size) {
        //$(document).trigger("sort", commands.join('!'));
    //}
    return this.a;
};

QuickSort.prototype.quickSort = function(low, high) {
    if(low + 3 > high) {
        this.a = insertionSort(this.a);
    }
    else {
/*        var middle = Math.floor(parseInt(low + high) / 2);
        if (this.a[middle] < this.a[low]) {
            this.a = swapReferences(this.a, low, middle);
            commands.push("swap(" + low + ", " + middle + ");");
        }
        if (this.a[high] < this.a[low]) {
            this.a = swapReferences(this.a, low, high);
            commands.push("swap(" + low + ", " + high + ");")
        }
        if (this.a[high] < this.a[middle]) {
            this.a = swapReferences(this.a, middle, high);
            commands.push("swap(" + middle + ", " + high + ");");
        }

        this.a = swapReferences(this.a, middle, high - 1);
        commands.push("swap(" + middle + ", " + (high - 1) + ");");*/
        var pivot = this.a[high - 1];

        var i, j;
        for (i = low, j = high - 1; ;) {
            while (this.a[++i] < pivot /*&& commands.push("markPivot(" + (i) + ", 'left');" )*/) {
            }
            while (pivot < this.a[--j] /*&& commands.push("markPivot(" + (j) + ", 'right');")*/) {
            }
            if (i >= j)
                break;
            this.a = swapReferences(this.a, i, j);
            commands.push("swap(" + i + " ," + j + ");");
        }
        this.a = swapReferences(this.a, i, high - 1);
        commands.push("swap(" + i + ", " + (high-1) + ");");

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

function insertionSort(a) {

    for(var p = 1; p < a.length; p++) {
        //commands.push("codeLineHighlight(2)");
        var tmp = a[p];
        //commands.push("codeLineHighlight(3)");
        var j = p;
        //commands.push("codeLineHighlight(4)");

        for(; j > 0 && commands.push("highlight( " + j + ", " + (j - 1) + ")") && tmp < a[j - 1]; j--) {
            a[j] = a[j - 1];

            //GUI
            commands.push("swap(" + j + ", " + (j - 1) + ");");
        }
        a[j] = tmp;
        //commands.push("codeLineHighlight(8)");
    }

    //commands.push("codeLineHighlight(10)");

    //Send commands to GUI
    $(document).trigger("sort", commands.join('!'));

    return a;
}
