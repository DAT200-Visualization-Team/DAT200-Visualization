// Merge sort


function MergeSort(arr) {
    this.a = arr;
}

MergeSort.prototype.sort = function() {
    this.mergeSort(this.a, 0, this.a.length - 1);
    return this.a;
};

MergeSort.prototype.mergeSort = function(a, left, right) {
    if(left < right) {
        var center = parseInt((left + right) / 2);
        this.mergeSort(this.a, left, center);
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
        if(this.a[leftPos] <= this.a[rightPos]) {
            tmpArray[tmpPos++] = this.a[leftPos++];
        } else {
            tmpArray[tmpPos++] = this.a[rightPos++];
        }
    }

    while(leftPos <= leftEnd) {
        tmpArray[tmpPos++] = this.a[leftPos++];
    }

    while(rightPos <= rightEnd) {
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
