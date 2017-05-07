// Queue class (array based )

function Queue() {
    this.theArray = [];
    this.currentSize = 0;
    this.front = 0;
    this.back = -1;
}

Queue.prototype.isEmpty = function() {
    return this.currentSize === 0;
};

Queue.prototype.makeEmpty = function() {
    this.currentSize = 0;
    this.front = 0;
    this.back = -1;
};

Queue.prototype.increment = function(x) {
    x++;

    if(x === this.theArray.length) {
        x = 0;
    }

    return x;
};

Queue.prototype.enqueue = function(x) {
    if (this.currentSize === this.theArray.length) {
        this.doubleQueue();
    }

    this.back = this.increment(this.back);
    this.theArray[this.back] = x;
    this.currentSize++;
};

Queue.prototype.dequeue = function() {
    if(this.isEmpty()) {
        throw {name: 'UnderflowException', message: 'Queue is empty (dequeue)'};
    }

    this.currentSize--;
    var returnVal = this.theArray[this.front];
    this.front = this.increment(this.front);
    return returnVal;
};

Queue.prototype.getFront = function() {
    if(this.isEmpty()) {
        throw {name: "UnderflowException", message: "Queue is empty (getFront)"};
    }

    return this.theArray[this.front];
};

Queue.prototype.doubleQueue = function() {
    var newArray = new Array(this.theArray.length * 2);
    for(var i = 0; i < this.currentSize; i++, this.front = this.increment(this.front)) {
        newArray[i] = this.theArray[this.front];
    }

    this.theArray = newArray;
    this.front = 0;
    this.back = this.currentSize - 1;
};