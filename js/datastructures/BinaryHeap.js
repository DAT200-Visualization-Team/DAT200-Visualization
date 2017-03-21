/**
 * Priority Queue / Binary Heap: Priority based on the smallest item
 */

//const DEFAULT_CAPACITY = 100;

function BinaryHeap(coll) {
    if (coll !== undefined) {
        this.currentSize = coll.length;
        this.array = new Array(parseInt((this.currentSize + 2) * 11 / 10));
        for(var i = 0; i < coll.length; i++) {
            this.array[i] = coll[i];
        }
        this.buildHeap();
    } else {
        this.currentSize = 0;
        this.array = new Array(100 + 1); //DEFAULT_CAPACITY + 1
    }
}

BinaryHeap.prototype.isEmpty = function() {
    return this.currentSize === 0;
};

BinaryHeap.prototype.size = function() {
    return this.currentSize;
};

BinaryHeap.prototype.element = function() {
    if(this.isEmpty()) {
        throw {name: "NoSuchElementException"};
    }
    return this.array[1];
};

BinaryHeap.prototype.doubleArray = function() {
    var newArray = new Array(this.array.length * 2);

    for(var i = 0; i < array.length; i++ ) {
        newArray[ i ] = array[ i ];
    }
    this.array = newArray;
};

BinaryHeap.prototype.add = function(x) {
    if(this.currentSize + 1 === this.array.length) {
        this.doubleArray();
    }

    // Percolate up
    var hole = ++this.currentSize;
    this.array[0] = x;

    for(; compare(x, this.array[parseInt(hole/2)]) < 0; hole = parseInt(hole / 2)) {
        this.array[hole] = this.array[parseInt(hole / 2)];
    }
    this.array[hole] = x;

    return true;
};

BinaryHeap.prototype.remove = function() {
    var minItem = this.element();
    this.array[1] = this.array[this.currentSize--];
    this.percolateDown(1);
    return minItem;
};

BinaryHeap.prototype.percolateDown = function(hole) {
    var child;
    var tmp = this.array[hole];

    for(; hole * 2 <= this.currentSize; hole = child) {
        child = hole * 2;
        if(child != this.currentSize && compare(this.array[child + 1], this.array[child]) < 0) {
            child++;
        }
        if(compare(this.array[child], tmp) < 0) {
            this.array[hole] = this.array[child];
        }
        else {
            break;
        }
    }
    this.array[hole] = tmp;
};

BinaryHeap.prototype.buildHeap = function() {
    for(var i = parseInt(this.currentSize / 2); i > 0; i--) {
        this.percolateDown(i);
    }
};

BinaryHeap.prototype.toArrayAndEmpty = function() {
    var arr = new Array(this.currentSize);
    var size = this.currentSize;
    for(var i = 0; i < size; i++) {
        arr[i] = this.remove();
    }
    return arr;
};

function compare(a, b) {
    if (a == null || b == null) return true;

    var type = a.constructor;

    switch (type) {
        case Path:
            return a.compareTo(b);
            break;
        default:
            return a - b;
    }
}