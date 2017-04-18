// Merge sort
var commands = [];

function MergeSort(arr) {
    this.a = arr;
}

MergeSort.prototype.sort = function() {
    this.mergeSort(this.a, 0, this.a.length - 1);
    $(document).trigger("sort", commands.join('!'));
    return this.a;
};

MergeSort.prototype.mergeSort = function(a, left, right) {
    if(left < right) {
        var center = parseInt((left + right) / 2);
        //commands.push("this.mergeSort(array, " + left + ", " + center + ");");
        commands.push("split(" + left + ", " + center + ", 'left');");
        this.mergeSort(this.a, left, center);

        //commands.push("this.mergeSort(array, " + (center + 1) + ", " + right + ");");
        commands.push("split(" + right + "," + (center + 1) + ", 'right');");
        this.mergeSort(this.a, center + 1, right);


        this.merge(this.a, left, center + 1, right);
    }
};

MergeSort.prototype.merge = function(a, leftPos, rightPos, rightEnd) {
    var tmpArray = [];
    var leftEnd = rightPos - 1;
    var tmpPos = leftPos;
    var numElements = rightEnd - leftPos + 1;

    while(leftPos <= leftEnd && rightPos <= rightEnd) {
        //TODO add highlighting to the values being compared
        if(this.a[leftPos] <= this.a[rightPos]) {
            commands.push("merge(" + tmpPos + ", " + leftPos + ", 'left');");
            tmpArray[tmpPos++] = this.a[leftPos++];
        } else {
            commands.push("merge(" + tmpPos + ", " + rightPos + ", 'right');");
            tmpArray[tmpPos++] = this.a[rightPos++];
        }
    }

    while(leftPos <= leftEnd) {
        commands.push("merge(" + tmpPos + ", " + leftPos + ", 'left');");
        tmpArray[tmpPos++] = this.a[leftPos++];
    }

    while(rightPos <= rightEnd) {
        commands.push("merge(" + tmpPos + ", " + rightPos + ", 'right');");
        tmpArray[tmpPos++] = this.a[rightPos++];
    }

    for(var i = 0; i < numElements; i++, rightEnd--) {
        a[rightEnd] = tmpArray[rightEnd];
    }
};


/*
function MergeSort(arr) {
    this.a = arr;
    this.tmpArray = new Array(this.a.length);
    this.sort(this.a, this.tmpArray, 0, this.a.length - 1);
    return this.a;
};
*/
