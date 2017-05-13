// Merge sort
function MergeSort(arr) {
    this.a = arr;
}

MergeSort.prototype.sort = function() {
    this.mergeSort(this.a, 0, this.a.length - 1);
    return this.a;
};

MergeSort.prototype.mergeSort = function (a, left, right) {
    highlightCode([0]);
    if (left < right) {
        highlightCode([1]);
        var center = parseInt((left + right) / 2);

        split(left, center, 'left', 2);
        this.mergeSort(this.a, left, center);

        split(center+1, right, 'right', 3);
        this.mergeSort(this.a, center + 1, right);

        highlightCode([4]);
        this.merge(this.a, left, center + 1, right);
    }
};

MergeSort.prototype.merge = function (a, leftPos, rightPos, rightEnd) {
    highlightCode([0, 1, 2, 3, 5], 'merge');
    var tmpArray = [];
    var leftEnd = rightPos - 1;
    var tmpPos = leftPos;
    var numElements = rightEnd - leftPos + 1;

    while (leftPos <= leftEnd && rightPos <= rightEnd) {
        highlightCode([6]);
        if(this.a[leftPos] <= this.a[rightPos]) {
            merge(tmpPos, leftPos, 7);
            tmpArray[tmpPos++] = this.a[leftPos++];
        }
        else {
            highlightCode([9]);
            merge(tmpPos, rightPos, 10);
            tmpArray[tmpPos++] = this.a[rightPos++];
        }
        highlightCode([5]);
    }

    highlightCode([14]);
    while(leftPos <= leftEnd) {
        merge(tmpPos, leftPos, 15);
        tmpArray[tmpPos++] = this.a[leftPos++];
        highlightCode([14]);
    }

    highlightCode([18]);
    while(rightPos <= rightEnd) {
        merge(tmpPos, rightPos, 19);
        tmpArray[tmpPos++] = this.a[rightPos++];
        highlightCode([18]);
    }

    highlightCode([22]);
    for(var i = 0; i < numElements; i++, rightEnd--) {
        a[rightEnd] = tmpArray[rightEnd];
        highlightCode([23,22]);
    }
};
