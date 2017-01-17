// Simple implementation of PriorityQueue using array

function PriorityQueue() {
    this.array = [];
    this.theSize = 0;
}

PriorityQueue.prototype.isEmpty = function() {
    return this.theSize === 0;
};

PriorityQueue.prototype.makeEmpty = function() {
    this.array = [];
    this.theSize = 0;
};

PriorityQueue.prototype.enqueue = function(item, priority) {
    if(this.isEmpty()) {
        this.array[0] = new Task(item, priority);
        this.theSize++;
    }
    else {
        for(var i = 0; i < this.array.length; i++) {
            if(i === this.array.length - 1 && this.array[i].priority >= priority) {
                this.array[++i] = new Task(item, priority)
                this.theSize++;
                break;
            }
            if(this.array[i].priority < priority) {
                var tmp = [];
                for(var j = i, k = 0; j < this.array.length; j++, k++) {
                    tmp[k] = this.array[j];
                }
                this.array[i] = new Task(item, priority);
                this.theSize++;
                for(i += 1, k = 0; k < tmp.length; i++, k++) {
                    this.array[i] = tmp[k];
                }
            }
        }
    }
};

PriorityQueue.prototype.dequeue = function() {
    if(this.isEmpty()) {
        throw {name: "NoSuchElementException", message: "Queue is empty."};
    }
    var returnVal = this.array[0];
    var tmp = [];
    for(var i = 1; i < this.array.length; i++) {
        tmp.push(this.array[i]);
    }
    this.array = tmp;
    this.theSize--;
    return returnVal;
};

PriorityQueue.prototype.getFront = function() {
    return this.array[0];
};
