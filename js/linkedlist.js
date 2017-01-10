// Linkedlist class
var head;
var tail;
var size;
var modCount;

function LinkedList() {
    head = new Node(null, null, null);
    tail = new Node(null, null, head);
    head.next = tail;
    size = 0;
}

LinkedList.prototype.clear = function() {
    head = new Node(null, null, null);
    tail = new Node(null, null, head);
    head.next = tail;
    size = 0;
    modCount++
};

LinkedList.prototype.getSize = function() {
    return size;
};

LinkedList.prototype.isEmpty = function() {
    return size === 0;
};

LinkedList.prototype.insertAfter = function(newNode, node) {
    newNode.prev = node;
    if (node.next == null) {
        tail = newNode;
    } else {
        newNode.next = node.next;
        node.next.prev = newNode;
    }
    node.next = newNode;
    size++;
    modCount++;
};

LinkedList.prototype.insertBefore = function(newNode, node) {
    newNode.next = node;
    if (node.prev == null) {
        head = newNode;
    } else {
        newNode.prev = node.prev;
        node.prev.next = newNode;
    }
    node.prev = newNode;
    size++;
    modCount++;
};

LinkedList.prototype.insertBeginning = function(newNode) {
    if (head == null) {
        head = newNode;
        tail = newNode;
        newNode.prev = null;
        newNode.next = null;
    } else {
        this.insertBefore(newNode, head);
    }
    size++;
    modCount++;
};

LinkedList.prototype.insertEnd = function(newNode) {
    if (tail == null) {
        this.insertBeginning(newNode);
    } else {
        this.insertAfter(tail, newNode);
    }
    size++;
    modCount++;
};

LinkedList.prototype.remove = function(node) {
    if (node.prev == null) {
        head = node.next;
    } else {
        node.prev.next = node.next;
    }
    if (node.next == null) {
        tail = node.prev;
    } else {
        node.next.prev = node.prev;
    }
    size--;
    modCount++;
 };

LinkedList.prototype.removeFirst = function() {
    this.remove(head);
    size--;
    modCount++;
};

LinkedList.prototype.removeLast = function() {
    this.remove(tail);
    size--;
    modCount++;
};

LinkedList.prototype.get = function(idx) {
    if (idx < this.getSize() / 2) {
        p = head.next;
        for (var i = 0; i < idx; i++) {
            p = p.next;
        }
    } else {
        p = tail;
        for (var i = this.getSize(); i > idx; i--) {
            p = p.prev;
        }
    }
    return p;
};

LinkedList.prototype.setAt = function(idx, newNode) {
    var node = this.get(idx);
    newNode.next = node;
    node.prev.next = newNode;
    size++;
    modCount++;
};

LinkedList.prototype.set = function(idx, data) {
    var node = this.get(idx);
    node.data = data;
    modCount++;
};

LinkedList.prototype.findPos = function(d) {
    var index = 0;
    var current = head;

    while (current !== null) {
        if (current.data == d) {
            return index;
        }
        index++;
        current = current.next;
    }
    return -1;
};

LinkedList.prototype.removeByIdx = function(idx) {
    tmp = this.get(idx);
    this.remove(tmp);
};

LinkedList.prototype.removeByData = function(data) {
    var idx = this.findPos(data);
    this.removeByIdx(idx);
};

LinkedList.prototype.toArray = function() {
    var list = [];
    var p = head;
    while (p !== tail) {
        console.log(9);
        p = p.next;
        list.push(p);
        console.log(p);
    }
    return p;
}



LinkedList.prototype.iterator = function() {
    var current = head.next;
    var lastAccessed = null;
    var index = 0;
    var isEmpty = this;

    return {
        hasNext: function() {return index < size && current != tail;},
        hasPrev: function() {return index > size && current != head;},
        previousIdx: function() {return index - 1;},
        nextIdx: function() {return index},

        next: function() {
            if (!this.hasNext()) {
                /*console.log(index);
                console.log(size);*/
                throw {name: "IndexOutOfBoundsException", message: "Index was out of bounds"};
            }
            lastAccessed = current;
            data = current.data;
            current = current.next;
            index++;
            return data;
        },

        prev: function() {
            if (!this.hasPrev()) {
                throw{name: "IndexOutOfBoundsException", message: "Index was out of bounds"};
            }
            current = current.prev;
            index--;
            lastAccessed = current;
            return current.data;
        },

        set: function(data) {
            if (lastAccessed == null) throw {name: "IllegalStateException", message: "No last accessed item"};
            lastAccessed.data = data;
        },

        remove: function() {
            if (lastAccessed == null) throw {name: "IllegalStateException", message: "No last accessed item"};
            var prevNode = lastAccessed.prev;
            var nextNode = lastAccessed.next;
            prevNode.next = nextNode;
            nextNode.prev = prevNode;
            size--;
            if(current === lastAccessed) {
                current == nextNode;
            } else {
                index--;
            }
            lastAccessed = null;
        },


    }
};









var lista = new LinkedList();
/*
lista.insertEnd("Hei");
lista.insertEnd(", du!")
console.log(lista);

lista.insertBefore(new Node("PREHEI"), lista.get("Hei"));
console.log(lista);
console.log(lista.get("PREHEI"));
*/

lista.insertBeginning(1);
lista.insertBeginning(2);
lista.insertBeginning(3);
lista.insertBeginning(4);
lista.insertBeginning(5);
lista.insertBeginning(6);
lista.insertBeginning(7);
console.log(lista.isEmpty());
console.log(lista.getSize());
lista.toArray();
/*lista.iterator().next();
lista.iterator().next();
lista.iterator().next();
lista.iterator().next();
lista.iterator().next();*/


