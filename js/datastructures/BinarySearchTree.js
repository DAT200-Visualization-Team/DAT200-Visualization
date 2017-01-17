function BinarySearchTree() {
    this.root = null;
}

BinarySearchTree.prototype.insert = function (x) {
    this.root = this.insertNode(x, this.root);
};

BinarySearchTree.prototype.remove = function (x) {
    this.root = this.removeNode(x, this.root);
};

BinarySearchTree.prototype.removeMin = function () {
    this.root = this.removeMinNode(this.root);
};

BinarySearchTree.prototype.findMin = function () {
    return this.elementAt(this.findMinNode(this.root));
};

BinarySearchTree.prototype.findMax = function () {
    return this.elementAt(this.findMaxNode(this.root));
};

BinarySearchTree.prototype.find = function (x) {
    return this.elementAt(this.find(x, this.root));
};

BinarySearchTree.prototype.makeEmpty = function () {
    this.root = null;
};

BinarySearchTree.prototype.isEmpty = function () {
    return this.root === null;
};

BinarySearchTree.prototype.elementAt = function (t) {
    return t === null ? null : t.getElement();
};

BinarySearchTree.prototype.findInTree = function (x, t) {
    while (t !== null) {
        if (x - t.getElement() < 0)
            t = t.getLeft();
        else if (x - t.getElement() > 0)
            t = t.getRight();
        else
            return t; // Match
    }

    return null; // Not Found
};

BinarySearchTree.prototype.findMinNode = function (t) {
    if (t !== null)
        while (t.getLeft() !== null)
            t = t.getLeft();
    return t;
};

BinarySearchTree.prototype.findMaxNode = function (t) {
    if (t !== null)
        while (t.getRight() !== null)
            t = t.getRight();
};

BinarySearchTree.prototype.insertNode = function (x, t) {
    if (t === null)
        t = new BinaryNode(x);
    else if (x - t.getElement() < 0)
        t.setLeft(insert(x, t.getLeft()));
    else if (x - t.getElement() > 0)
        t.setRight(x, t.getRight());
    else
        throw { name: "DuplicateItemException", message: "Duplicate items are not allowed" };
    return t;
};

BinarySearchTree.prototype.removeMinNode = function (t) {
    if (t === null)
        throw { name: "ItemNotFoundException", message: "The item was not found" };
    else if (t.getLeft() !== null) {
        t.setLeft(this.removeMinNode(t.getLeft()));
        return t;
    }
    else
        return t.getRight();
};

BinarySearchTree.prototype.removeNode = function (x, t) {
    if (t === null)
        throw { name: "ItemNotFoundException", message: "The item was not found" };
    if (x - t.getElement() < 0)
        t.setLeft(this.remove(x, t.getLeft()));
    else if (x - t.getElement() > 0)
        t.setRight(this.remove(x, t.getRight()));
    else if (t.getLeft() !== null && t.getRight() !== null) { // Two children
        t.setElement(this.findMinNode(t.getRight()).getElement());
        t.setRight(this.removeMinNode(t.getRight()));
    }
    else
        t = (t.getLeft() !== null) ? t.getLeft() : t.getRight();
    return t;
};