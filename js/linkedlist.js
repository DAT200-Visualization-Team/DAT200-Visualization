// Linkedlist class
var head;
var tail;
var theSize;
var modCount;

function LinkedList() {
    head = new Node(null, null, null);
    tail = new Node(null, head, null);
    head.next = tail;
    theSize = 0;
}

LinkedList.prototype.clear = function() {
    head = new Node(null, null, null);
    tail = new Node(null, head, null);
    head.next = tail;
    theSize = 0;
    modCount++;
};

LinkedList.prototype.size = function() {
    return theSize;
};

LinkedList.prototype.isEmpty = function() {
    return theSize === 0;
};

LinkedList.prototype.add = function(idx, data) {
    var p = this.getNode(idx);
    var newNode = new Node(data, p.prev, p);
    newNode.prev.next = newNode;
    p.prev = newNode;
    theSize++;
    modCount++;
}

LinkedList.prototype.addFirst = function(data) {
    this.add(0, data);
}

LinkedList.prototype.addLast = function(data) {
    this.add(this.size(), data);
}

LinkedList.prototype.removeNode = function(p) {
    p.next.prev = p.prev;
    p.prev.next = p.next;
    theSize--;
    modCount++;
    return p.data;
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

LinkedList.prototype.removeByIdx = function(idx) {
    return this.removeNode(this.getNode(idx));
};

LinkedList.prototype.removeByData = function(data) {
    var idx = this.findPos(data);
    if (idx == -1) {
        return false;
    }
    else {
        this.removeByIdx(idx);
        return true;
    }
};

LinkedList.prototype.getNode = function(idx) {
    if (idx < this.size() / 2) {
        p = head.next;
        for (var i = 0; i < idx; i++) {
            p = p.next;
        }
    } else {
        p = tail;
        for (var i = this.size(); i > idx; i--) {
            p = p.prev;
        }
    }
    return p;
};

/*LinkedList.prototype.setAt = function(idx, newNode) {
    var node = this.getNode(idx);
    newNode.next = node;
    node.prev.next = newNode;
    theSize++;
    modCount++;
};*/

LinkedList.prototype.set = function(idx, newVal) {
    var p = this.getNode(idx);
    var oldVal = p.data;
    p.data = newVal;
    return oldVal;
};

LinkedList.prototype.findPos = function(x) {
    for(var p = head.next; p !== tail; p = p.next) {
        if (x === null) {
            if(p.data === null) {
                return p;
            }
        }
        else if(x == p.data) { //must really use x.equals(p.data)
            return p;
        }
        return -1;
    }
};

LinkedList.prototype.toArray = function() {
    var list = [];
    var p = head;
    while (p.next !== tail) {
        p = p.next;
        list.push(p);
    }
    console.log(list);
    return list;
};

LinkedList.prototype.iterator = function(idx) {
    var current = this.getNode(idx);
    var lastVisited = null;
    var lastMoveWasPrev = false;
    var expectedModCount = modCount;

    return {
        hasNext: function() {
            if (expectedModCount !== modCount) {
                throw {name: "ConcurrentModificationException", message: "Expected modification count was not equal to actual modcount"};
            }
            return current != tail;
        },

        hasPrev: function() {
            if (expectedModCount !== modCount) {
                throw {name: "ConcurrentModificationException", message: "Expected modification count was not equal to actual modcount"};
            }
            return current !== head.next;
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
            if (expectedModCount !== modCount) {
                throw {
                    name: "ConcurrentModificationException",
                    message: "Expected modification count was not equal to actual modcount"
                };
            }
            if(lastVisited === null) {
                throw {name: "IllegalStateException"}
            }
            this.removeNode(lastVisited);
            lastVisited = null;
            if(lastMoveWasPrev) {
                current = current.next;
            }
            expectedModCount++;
        }


    }
};








var lista = new LinkedList();


console.log("begin");
/*lista.addLast(1);
console.log("started");
lista.addLast(2);
lista.addLast(3);
lista.addLast(4);
lista.addLast(5);
lista.addLast(6);
lista.addLast(7);*/

lista.addFirst(1);
console.log("started");
lista.addFirst(2);
lista.addFirst(3);
lista.addFirst(4);
lista.addFirst(5);
lista.addFirst(6);

