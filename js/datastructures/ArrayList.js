const DEFAULT_CAPACITY = 5;
const NOT_FOUND = -1;

function ArrayList(other) {
    this.theItems;
    this.theSize;
    this.modCount = 0;

    this.capacity = DEFAULT_CAPACITY;

    this.clear();
    if (!other)
        return;

    if (other.constructor === Array) {
        for (var i = 0; i < other.length; i++)
            this.add(other[i]);
    }
}

ArrayList.prototype.size = function () {
    return this.theSize;
};

ArrayList.prototype.clear = function () {
    this.theSize = 0;
    this.theItems = new Array(DEFAULT_CAPACITY);
    this.modCount++;

    this.capacity = DEFAULT_CAPACITY;
};

ArrayList.prototype.get = function (index) {
    if (index < 0 || index >= this.size())
        throw { name: "ArrayIndexOutOfBoundsException", message: "The index was out of bounds" };
    return this.theItems[index];
};

ArrayList.prototype.set = function (index, newVal) {
    if (index < 0 || index >= this.size())
        throw { name: "ArrayIndexOutOfBoundsException", message: "The index was out of bounds" };
    old = this.theItems[index];
    this.theItems[index] = newVal;

    return old;
};

ArrayList.prototype.contains = function (x) {
    return this.findPos(x) != NOT_FOUND;
};

ArrayList.prototype.findPos = function (x) {
    for (var i = 0; i < this.size() ; i++) {
        if (x === null) {
            if (this.theItems[i] === null)
                return i;
        }
        else if (x === this.theItems[i])
            return i;
    }

    return NOT_FOUND;
};

ArrayList.prototype.add = function (x) {
    // Ensure capacity
    if (this.theItems.length == this.size()) {
        var old = this.theItems;
        this.theItems = new Array(this.theSize * 2 + 1);
        for (var i = 0; i < this.size() ; i++)
            this.theItems[i] = old[i];
    }

    //Ensure capacity
    highlightCode([1]);
    if (this.capacity == this.theSize) {
        highlightCode([2]);
        extendCapacity(this.capacity*2+1, this.capacity, false);
        this.capacity = this.capacity * 2 + 1;
    }

    add(this.theSize, x, false);
    this.theItems[this.theSize++] = x;
    updateTheSize(this.theSize, this.capacity, null, '-=2');
    this.modCount++;

    highlightCode([9, 11]);
    return true;
};

ArrayList.prototype.addByIndex = function (index, x) {
    highlightCode([0]);
    if(index < 0 || index > this.theSize) return false; // Out of bounds
    // Ensure capacity
    if (this.theItems.length == this.size()) {
        var old = this.theItems;
        this.theItems = new Array(this.theSize * 2 + 1);
        for (var i = 0; i < this.size() ; i++)
            this.theItems[i] = old[i];
    }

    //Ensure capacity
    highlightCode([2]);
    if (this.capacity == this.theSize) {
        highlightCode([3]);
        extendCapacity(this.capacity*2+1, this.capacity, true);
        this.capacity = this.capacity * 2 + 1;
    }

    // Check if index is within array
    for(var j = this.capacity; j >= index; j--) {
        if(j < this.theSize) highlightCode([9]);
        move(j, this.capacity, this.theSize);
    }

    add(index, x, true);
    this.theItems[index] = x;
    this.theSize++;
    highlightCode([13]);
    updateTheSize(this.theSize, this.capacity, null, '-=2');
    this.modCount++;

    highlightCode([14, 16]);
    return true;
};

ArrayList.prototype.remove = function (x) {
    var pos = this.findPos(x);

    if (pos == NOT_FOUND)
        return false;

    this.removeAtPos(pos);
    return true;
};

ArrayList.prototype.removeAtPos = function (index) {
    highlightCode([0, 2]);
    var removedItem = this.theItems[index];

    for (var i = index; i < this.theSize - 1; i++) {
        remove(i+1, this.capacity);
        this.theItems[i] = this.theItems[i + 1];
        highlightCode([2]);
    }

    this.theSize--;
    this.modCount++;

    updateTheSize(this.theSize, this.capacity, 6);
    highlightCode([7, 9]);

    return removedItem;
};

ArrayList.prototype.iterator = function (startIndex) {
    var nextIndex = 0;
    var expectedModCount = this.modCount;
    var nextCompleted = false;
    var prevCompleted = false;
    var arrayList = this;

    if (startIndex >= 0 && startIndex < this.theItems.length)
        nextIndex = startIndex;

    return {
        next: function () {
            nextCompleted = true;
            prevCompleted = false;

            return nextIndex < arrayList.theItems.length ? { value: arrayList.theItems[nextIndex++], done: false } : { done: true };
        },

        previous: function () {
            nextCompleted = false;
            prevCompleted = true;

            return nextIndex >= 0 ? { value: arrayList.theItems[--nextIndex], done: false } : { done: true };
        },

        remove: function () {
            if (expectedModCount !== arrayList.modCount)
                throw { name: "ConcurrentModificationException", message: "The collection was modified concurrently" };

            if (nextCompleted)
                arrayList.removeAtPos(--nextIndex);
            else if (prevCompleted)
                arrayList.removeAtPos(nextIndex);
            else
                throw { name: "IllegalStateException", message: "Can't remove before calling next or previous" };

            prevCompleted = nextCompleted = false;
            expectedModCount++;
        }
    };
};
