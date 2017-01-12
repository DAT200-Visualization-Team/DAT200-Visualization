const DEFAULT_TABLE_SIZE = 101;

function HashSet(other) {
    this.currentSize = 0;
    this.occupied = 0;
    this.modCount = 0;
    this.array;

    this.allocateArray(DEFAULT_TABLE_SIZE);
    this.clear();

    if (other) {
        if (other.constructor === Array)
            for (var i = 0; i < other.length; i++)
                this.add(other[i])
    }
}

HashSet.prototype.getMatch = function (x) {
    var currentPos = this.findPos(x);

    if (this.isActive(this.array, currentPos))
        return this.array[currentPos].element;
    return null;
};

HashSet.prototype.contains = function (x) {
    return this.isActive(this.array, this.findPos(x));
};

HashSet.prototype.size = function () {
    return this.currentSize;
};

HashSet.prototype.isActive = function (arr, pos) {
    return arr[pos] != null && arr[pos].isActive;
};

HashSet.prototype.remove = function (x) {
    var currentPos = this.findPos(x);
    if (!this.isActive(this.array, currentPos))
        return false;

    this.array[currentPos].isActive = false;
    this.currentSize--;
    this.modCount++;

    if (this.currentSize < this.array.length / 8)
        this.rehash();

    return true;
};

HashSet.prototype.clear = function () {
    this.currentSize = this.occupied = 0;
    this.modCount++;
    for (var i = 0; i < this.array.length; i++)
        this.array[i] = null;
};

HashSet.prototype.add = function (x) {
    var currentPos = this.findPos(x);

    if (this.isActive(this.array, currentPos))
        return false;

    if (this.array[currentPos] == null)
        this.occupied++;
    this.array[currentPos] = new HashEntry(x, true);
    this.currentSize++;
    this.modCount++;

    if (this.occupied > this.array.length / 2)
        this.rehash();

    return true;
};

HashSet.prototype.rehash = function () {
    var oldArray = this.array;

    // Create new empty table
    this.allocateArray(nextPrime(4 * this.size()));
    this.currentSize = 0;
    this.occupied = 0;

    // Copy table over
    for (var i = 0; i < oldArray.length; i++)
        if (this.isActive(oldArray, i))
            this.add(oldArray[i].element);
};

HashSet.prototype.findPos = function (x) {
    var offset = 1;
    var currentPos = (x == null) ? 0 : Math.abs(getHashCode(x) % this.array.length);

    while (this.array[currentPos] != null) {
        if (x == null) {
            if (this.array[currentPos].element == null)
                break;  
        }
        else if (x == this.array[currentPos].element)
            break;

        currentPos += offset; // Compute ith probe
        offset += 2;
        if (currentPos >= this.array.length) // Implement the mod
            currentPos -= this.array.length;
    }

    return currentPos;
};

HashSet.prototype.allocateArray = function (arraySize) {
    this.array = new Array(arraySize)
}

HashSet.prototype.iterator = function () {
    var expectedModCount = this.modCount;
    var currentPos = -1;
    var visited = 0;
    var hashSet = this;

    return {
        hasNext: function(){
            if(expectedModCount != hashSet.modCount)
                throw { name: "ConcurrentModificationException", message: "The HashTable was modified concurrently" };

            return visited != hashSet.size();
        },

        next: function () {
            if (!this.hasNext())
                throw { name: "NoSuchElementException", message: "No such element found." };

            do {
                currentPos++;
            }
            while (currentPos < hashSet.array.length && !hashSet.isActive(hashSet.array, currentPos));

            visited++;
            return hashSet.array[currentPos].element;
        },

        remove: function () {
            if(expectedModCount != hashSet.modCount)
                throw { name: "ConcurrentModificationException", message: "The HashTable was modified concurrently" };
            if (currentPos == -1 || !hashSet.isActive(hashSet.array, currentPos))
                throw { name: "IllegalStateException", message: "Entered an illegal state" };

            hashSet.array[currentPos].isActive = false;
            hashSet.currentSize--;
            visited--;
            hashSet.modCount++;
            expectedModCount++;
        }
    };
};