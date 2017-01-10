const DEFAULT_TABLE_SIZE = 101;

var currentSize = 0;
var occupied = 0;
var modCount = 0;
var array = [];

function HashSet(other) {
    // TODO: Invoke animation for allocating array here.
    this.clear();

    if(typeof other !== 'undefined')
        for(var i = 0; i < other.length; i++)
            this.add(other[i])
}

HashSet.prototype.getMatch = function (x) {
    var currentPos = this.findPos(x);

    if (this.isActive(array, currentPos))
        return array[currentPos].element;
    return null;
};

HashSet.prototype.contains = function (x) {
    return this.isActive(array, this.findPos(x));
};

HashSet.prototype.size = function () {
    return array.length;
};

HashSet.prototype.isActive = function (arr, pos) {
    return arr[pos] != null && arr.pos.isActive;
};

HashSet.prototype.remove = function (x) {
    var currentPos = this.findPos(x);
    if (!this.isActive(array, currentPos))
        return false;

    array[currentPos].isActive = false;
    currentSize--;
    modCount++;

    if (currentSize < array.length / 8)
        this.rehash();

    return true;
};

HashSet.prototype.clear = function () {
    currentSize = occupied = 0;
    modCount++;
    for (var i = 0; i < array.length; i++)
        array[i] = null;
};

HashSet.prototype.add = function (x) {
    var currentPos = this.findPos(x);
    if (this.isActive(array, currentPos))
        return false;

    if (array[currentPos] === null)
        occupied++;
    array[currentPos] = new HashEntry(x, true);
    currentSize++;
    modCount++;

    if (occupied > array.length / 2)
        this.rehash();

    return true;
};

HashSet.prototype.rehash = function () {
    var oldArray = array;

    // Create new empty table
    // TODO: Show allocation of new array
    array = [];
    currentSize = 0;
    occupied = 0;

    // Copy table over
    for (var i = 0; i < oldArray.length; i++)
        if (this.isActive(oldArray, i))
            this.add(oldArray[i].element);
};

HashSet.prototype.findPos = function (x) {
    var offset = 1;
    var currentPos = (x === null) ? 0 : x.hashCode % array.length;

    while (array[currentPos] !== null) {
        if (x === null)
            if (array[currentPos].element === null)
                break;
            else if (x.element == array[currentPos].element)
                break;

        currentPos += offset; // Compute ith probe
        offset += 2;
        if (currentPos >= array.length) // Implement the mod
            currentPos -= array.length;
    }

    return currentPos;
};

HashSet.prototype.iterator = function () {
    var expectedModCount = modCount;
    var currentPos = -1;
    var visited = 0;
    var hashSet = this;

    return {
        hasNext: function(){
            if(expectedModCount != modCount)
                throw { name: "ConcurrentModificationException", message: "The HashTable was modified concurrently" };

            return visited != hashSet.size();
        },

        next: function () {
            if (!this.hasNext())
                throw { name: "NoSuchElementException", message: "No such element found." };

            do {
                currentPos++;
            }
            while (currentPos < hashSet.size() && !hashSet.isActive(array, currentPos));

            visited++;
            return array[currentPos].element;
        },

        remove: function () {
            if(expectedModCount != modCount)
                throw { name: "ConcurrentModificationException", message: "The HashTable was modified concurrently" };
            if (currentPos == -1 || !hashSet.isActive(array, currentPos))
                throw { name: "IllegalStateException", message: "Entered an illegal state" };

            array[currentPos].isActive = false;
            currentSize--;
            visited--;
            modCount++;
            expectedModCount++;
        }
    };
};