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

        split(left, center, 'left');
        this.mergeSort(this.a, left, center);

        split(center+1, right, 'right');
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
            merge(tmpPos, leftPos);
            tmpArray[tmpPos++] = this.a[leftPos++];
        } else {
            merge(tmpPos, rightPos);
            tmpArray[tmpPos++] = this.a[rightPos++];
        }
    }

    while(leftPos <= leftEnd) {
        merge(tmpPos, leftPos);
        tmpArray[tmpPos++] = this.a[leftPos++];
    }

    while(rightPos <= rightEnd) {
        merge(tmpPos, rightPos);
        tmpArray[tmpPos++] = this.a[rightPos++];
    }

    for(var i = 0; i < numElements; i++, rightEnd--) {
        a[rightEnd] = tmpArray[rightEnd];
    }
};
