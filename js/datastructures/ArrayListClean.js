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
    for (var i = 0; i < this.size(); i++) {
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
        for (var i = 0; i < this.size(); i++)
            this.theItems[i] = old[i];
    }

    this.theItems[this.theSize++] = x;
    this.modCount++;

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
    var removedItem = this.theItems[index];

    for (var i = index; i < this.theSize - 1; i++) {
        this.theItems[i] = this.theItems[i + 1];
    }

    this.theSize--;
    this.modCount++;

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

ArrayList.prototype.varString = function (varName) {
	items = "[" + this.theItems.join(", ") + "]";
	return varName + ":<br/> &emsp; theItems: " + items + "<br/> &emsp; theSize: " + this.theSize + "<br/> &emsp; modCount: " + this.modCount + "<br/> &emsp; capacity: " + this.capacity;
};