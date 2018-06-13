const DEFAULT_TABLE_SIZE = 11;

function HashSet(other) {
    this.probingType = "linear";
    this.currentSize = 0;
    this.occupied = 0;
    this.modCount = 0;
	this.array;
	this.hashFunc = getSimpleHashCode;

    this.allocateArray(DEFAULT_TABLE_SIZE);
    this.clear();

    if (other) {
        if (other.constructor === Array)
	        for (var i = 0; i < other.length; i++)
		        this.add(other[i]);
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
    highlightCode([0]);
    var currentPos = this.findPos(x);
    highlightCode([1], 'remove');
    if (!this.isActive(this.array, currentPos)) {
        highlightCode([2]);
        return false;
    }

    this.array[currentPos].isActive = false;
    removeElement(currentPos);
    highlightCode([5, 6, 8]);
    this.currentSize--;
    this.modCount++;

    if (this.currentSize < this.array.length / 8) {
        highlightCode([9]);
        this.rehash();
    }

    highlightCode([11], 'remove');
    unhighlightKey();
    return true;
};

HashSet.prototype.clear = function () {
    this.currentSize = this.occupied = 0;
    this.modCount++;
    for (var i = 0; i < this.array.length; i++)
        this.array[i] = null;
};

HashSet.prototype.add = function (x) {
    add(x.toString());
    highlightCode([0], 'add');
    var currentPos = this.findPos(x);

    highlightCode([1], 'add');
    if (this.isActive(this.array, currentPos)) {
        highlightCode([2]);
        return false;
    }

    highlightCode([4]);
    if (this.array[currentPos] == null) {
        highlightCode([5]);
        this.occupied++;
    }

    this.array[currentPos] = new HashEntry(x, true);
    replaceElement(currentPos);
    highlightCode([7, 8, 10]);
    this.currentSize++;
    this.modCount++;

    if (this.occupied > this.array.length / 2) {
        highlightCode([11]);
        this.rehash();
    }

    highlightCode([13], 'add');
    unhighlightKey();
    return true;
};

HashSet.prototype.rehash = function () {
    highlightCode([0], 'rehash');
    var oldArray = this.array;

    // Create new empty table
    this.allocateArray(nextPrime(4 * this.size()));
    this.currentSize = 0;
    this.occupied = 0;
    renewTable(this.array.length);
    highlightCode([4, 5, 8]);

    // Copy table over
    for (var i = 0; i < oldArray.length; i++) {
        highlightCode([9]);
        if (this.isActive(oldArray, i)) {
            highlightCode([10]);
            this.add(oldArray[i].element);
        }
        highlightCode([8], 'rehash');
    }
};

HashSet.prototype.findPos = function (x) {
    var offset = 1;
    var currentPos = (x == null) ? 0 : Math.abs(this.hashFunc(x) % this.array.length);

    displayHash(this.hashFunc(x), this.array.length, 0);
    updateArrow(currentPos);

    var interation = 1;
    while (this.array[currentPos] != null) {
        if (x == null) {
            if (this.array[currentPos].element == null)
                break;
        }
        else if (x == this.array[currentPos].element)
            break;

        currentPos += offset; // Compute ith probe
        displayHash(this.hashFunc(x), this.array.length, offset);

        interation += 1;
        if(this.probingType == "quadratic") {
            offset = Math.pow(interation, 2);
        } else {
            offset += 1;
        }

        if (currentPos >= this.array.length) // Implement the mod
            currentPos -= this.array.length;

        updateArrow(currentPos);
    }

    return currentPos;
};

HashSet.prototype.allocateArray = function (arraySize) {
    this.array = new Array(arraySize)
};

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
