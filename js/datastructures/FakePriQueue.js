/**
 * Priority Queue: Priority based on largest element
 */
function FakePriQueue() {
    this.array = [];
    this.theSize = 0;
}

FakePriQueue.prototype.isEmpty = function() {
    return this.theSize === 0;
};

FakePriQueue.prototype.makeEmpty = function() {
    this.array = [];
    this.theSize = 0;
};

FakePriQueue.prototype.enqueue = function(item) {
    if(this.isEmpty()) {
        this.array[0] = item;
    }
    else {
        this.array.push(item);
        this.array = insertionSort(this.array);
    }
    this.theSize++;
};

FakePriQueue.prototype.dequeue = function() {
    if(this.isEmpty()) {
        throw {name: "NoSuchElementException", message: "Queue is empty."};
    }
    var returnVal = this.array.pop()
    this.theSize--;
    return returnVal;
};

FakePriQueue.prototype.getFront = function() {
    return this.array[0];
};


/*
var fpq = new FakePriQueue();
fpq.enqueue(3);
fpq.enqueue(6);
fpq.enqueue(9);
fpq.enqueue(1);
fpq.enqueue(2);
fpq.enqueue(7);
fpq.enqueue(9);
fpq.enqueue(4);
console.log(fpq.array);
console.log(fpq.dequeue());
console.log(fpq.array);

*/

