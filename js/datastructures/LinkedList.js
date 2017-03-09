// Linkedlist class
function LinkedList() {
    this.head = new Node(null, null, null);
    this.tail = new Node(null, this.head, null);
    this.head.next = this.tail;
    this.theSize = 0;
    this.modCount = 0;
}

LinkedList.prototype.clear = function() {
    this.head = new Node(null, null, null);
    this.tail = new Node(null, this.head, null);
    this.head.next = this.tail;
    this.theSize = 0;
    this.modCount++;
};

LinkedList.prototype.size = function() {
    return this.theSize;
};

LinkedList.prototype.isEmpty = function() {
    return this.theSize === 0;
};

LinkedList.prototype.add = function(idx, data) {
    var p = this.getNode(idx);
    var newNode = new Node(data, p.prev, p);
    newNode.prev.next = newNode;
    p.prev = newNode;
    this.theSize++;
    this.modCount++;
};

LinkedList.prototype.addFirst = function(data) {
    this.add(0, data);
};

LinkedList.prototype.addLast = function(data) {
    this.add(this.size(), data);
};

LinkedList.prototype.removeNode = function(p) {
    p.next.prev = p.prev;
    p.prev.next = p.next;
    this.theSize--;
    this.modCount++;
    return p.data;
};

LinkedList.prototype.removeByIdx = function(idx) {
    return this.removeNode(this.getNode(idx));
};

LinkedList.prototype.removeFirst = function() {
    if (this.isEmpty()) {
        throw {name: "NoSuchElementException", message: "List is empty."};
    }
    return this.removeByIdx(0);
};

LinkedList.prototype.removeLast = function() {
    if (this.isEmpty()) {
        throw {name: "NoSuchElementException", message: "List is empty."};
    }
    return this.removeByIdx(this.size() - 1);
};

LinkedList.prototype.removeByData = function(data) {
    var pos = this.findPos(data);
    if (pos == -1) {
        return false;
    }
    else {
        this.removeNode(pos);
        return true;
    }
};

LinkedList.prototype.getNode = function(idx) {
    var p;
    if (idx < this.size() / 2) {
        p = this.head.next;
        for (var i = 0; i < idx; i++) {
            p = p.next;
        }
    } else {
        p = this.tail;
        for (var i = this.size(); i > idx; i--) {
            p = p.prev;
        }
    }
    return p;
};

LinkedList.prototype.set = function(idx, newVal) {
    var p = this.getNode(idx);
    var oldVal = p.data;
    p.data = newVal;
    return oldVal;
};

LinkedList.prototype.findPos = function(x) {
    for(var p = this.head.next; p !== this.tail; p = p.next) {
        if (x === null) {
            if(p.data === null) {
                return p;
            }
        }
        else if(x === p.data) { //must really use x.equals(p.data)
            return p;
        }
    }
    return -1;
};

LinkedList.prototype.toArray = function() {
    var list = [];
    var p = this.head;
    while (p.next !== this.tail) {
        p = p.next;
        list.push(p.data);
    }
    return list;
};

LinkedList.prototype.iterator = function(idx) {
    var current = this.getNode(idx);
    var lastVisited = null;
    var lastMoveWasPrev = false;
    var expectedModCount = this.modCount;
    var linkedList = this;

    return {
        hasNext: function() {
            if (expectedModCount !== linkedList.modCount) {
                throw {
                    name: "ConcurrentModificationException",
                    message: "Expected modification count was not equal to actual modcount"};
            }
            return current != linkedList.tail;
        },

        hasPrev: function() {
            if (expectedModCount !== linkedList.modCount) {
                throw {
                    name: "ConcurrentModificationException",
                    message: "Expected modification count was not equal to actual modcount"};
            }
            return current !== linkedList.head.next;
        },

        next: function() {
            if (!this.hasNext()) {
                throw {name: "NoSuchElementException", message: "There is no next element"};
            }
            var nextItem = current.data;
            lastVisited = current;
            current = current.next;
            lastMoveWasPrev = false;
            return nextItem;
        },

        previous: function() {
            if (!this.hasPrev()) {
                throw {name: "NoSuchElementException", message: "There is no previous element"};
            }
            current = current.prev;
            lastVisited = current;
            lastMoveWasPrev = true;
            return current.data;
        },

        remove: function() {
            if (expectedModCount !== linkedList.modCount) {
                throw {
                    name: "ConcurrentModificationException",
                    message: "Expected modification count was not equal to actual modcount"
                };
            }
            if(lastVisited === null) {
                throw {name: "IllegalStateException"}
            }
            linkedList.removeNode(lastVisited);
            lastVisited = null;
            if(lastMoveWasPrev) {
                current = current.next;
            }
            expectedModCount++;
        }
    }
};
