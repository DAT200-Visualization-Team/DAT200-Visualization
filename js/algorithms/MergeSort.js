// Merge sort
function MergeSort(arr) {
    this.a = arr;
}

MergeSort.prototype.sort = function() {
    this.mergeSort(this.a, 0, this.a.length - 1);
    return this.a;
};

MergeSort.prototype.mergeSort = function (a, left, right) {
    updateMergeSortPositionVars(a, left, right);
    highlightCode([0]);
    if (left < right) {
        highlightCode([1]);
        var center = parseInt((left + right) / 2);
        updateVariable("center", center.toString());

        split(left, center, 'left', 2);
        this.mergeSort(this.a, left, center);
        updateMergeSortPositionVars(a, left, right);

        split(center+1, right, 'right', 3);
        this.mergeSort(this.a, center + 1, right);
        updateMergeSortPositionVars(a, left, right);

        highlightCode([4]);
        this.merge(this.a, left, center + 1, right);
    }
};

MergeSort.prototype.merge = function (a, leftPos, rightPos, rightEnd) {
    updateMergePositionVars(a, leftPos, rightPos, rightEnd);
    
    highlightCode([0], 'merge');
    var tmpArray = [];
    updateVariable("tmpArray", "[" + tmpArray.join(", ") + "]")

    highlightCode([1]);
    var leftEnd = rightPos - 1;
    updateVariable("leftEnd", leftEnd.toString())

    highlightCode([2]);
    var tmpPos = leftPos;
    updateVariable("tmpPos", tmpPos.toString())

    highlightCode([3]);
    var numElements = rightEnd - leftPos + 1;
    updateVariable("numElements", numElements.toString())

    highlightCode([5]);
    while (leftPos <= leftEnd && rightPos <= rightEnd) {
        highlightCode([6]);
        if(this.a[leftPos] <= this.a[rightPos]) {
            merge(tmpPos, leftPos, 7);
            tmpArray[tmpPos++] = this.a[leftPos++];
            updateVariable("tmpPos", tmpPos.toString());
            updateVariable("leftPos", leftPos.toString());
            updateVariable("tmpArray", "[" + tmpArray.join(", ") + "]");
        }
        else {
            highlightCode([9]);
            merge(tmpPos, rightPos, 10);
            tmpArray[tmpPos++] = this.a[rightPos++];
            updateVariable("tmpPos", tmpPos.toString());
            updateVariable("rightPos", rightPos.toString());
            updateVariable("tmpArray", "[" + tmpArray.join(", ") + "]");
        }
        highlightCode([5]);
    }

    highlightCode([14]);
    while(leftPos <= leftEnd) {
        merge(tmpPos, leftPos, 15);
        tmpArray[tmpPos++] = this.a[leftPos++];
        updateVariable("tmpPos", tmpPos.toString());
        updateVariable("leftPos", leftPos.toString());
        updateVariable("tmpArray", "[" + tmpArray.join(", ") + "]");
        highlightCode([14]);
    }

    highlightCode([18]);
    while(rightPos <= rightEnd) {
        merge(tmpPos, rightPos, 19);
        tmpArray[tmpPos++] = this.a[rightPos++];
        updateVariable("tmpPos", tmpPos.toString());
        updateVariable("rightPos", rightPos.toString());
        updateVariable("tmpArray", "[" + tmpArray.join(", ") + "]");
        highlightCode([18]);
    }

    highlightCode([22]);
    for (var i = 0; i < numElements; i++, rightEnd--) {
        updateVariable("i", i.toString());
        highlightCode([23]);
        a[rightEnd] = tmpArray[rightEnd];
        updateVariable("a", "[" + a.join(", ") + "]");
        highlightCode([22]);
    }
};

function updateMergeSortPositionVars(a, left, right) {
    updateVariable("a", "[" + a.join(", ") + "]");
    updateVariable("left", left.toString());
    updateVariable("right", right.toString());
}

function updateMergePositionVars(a, leftPos, rightPos, rightEnd) {
    updateVariable("a", "[" + a.join(", ") + "]");
    updateVariable("leftPos", leftPos.toString());
    updateVariable("rightPos", rightPos.toString());
    updateVariable("rightEnd", rightEnd.toString());
}
