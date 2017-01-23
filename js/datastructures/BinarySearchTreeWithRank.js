function BinarySearchTreeWithRank() {
    this.root = null;
}

BinarySearchTreeWithRank.prototype.insert = function (x) {
    this.root = this.insertNode(x, this.root);
};

BinarySearchTreeWithRank.prototype.remove = function (x) {
    this.root = this.removeNode(x, this.root);
};

BinarySearchTreeWithRank.prototype.removeMin = function () {
    this.root = this.removeMinNode(this.root);
};

BinarySearchTreeWithRank.prototype.findMin = function () {
    return this.elementAt(this.findMinNode(this.root));
};

BinarySearchTreeWithRank.prototype.findMax = function () {
    return this.elementAt(this.findMaxNode(this.root));
};

BinarySearchTreeWithRank.prototype.find = function (x) {
    return this.elementAt(this.findNode(x, this.root));
};

BinarySearchTreeWithRank.prototype.findKth = function (k) {
    return this.findKthNode(k, this.root).getElement();
};

BinarySearchTreeWithRank.prototype.makeEmpty = function () {
    this.root = null;
};

BinarySearchTreeWithRank.prototype.isEmpty = function () {
    return this.root == null;
};

BinarySearchTreeWithRank.prototype.elementAt = function (t) {
    return t === null ? null : t.getElement();
};

BinarySearchTreeWithRank.prototype.findNode = function (x, t) {
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

BinarySearchTreeWithRank.prototype.findMinNode = function (t) {
    if (t !== null)
        while (t.getLeft() !== null)
            t = t.getLeft();
    return t;
};

BinarySearchTreeWithRank.prototype.findMaxNode = function (t) {
    if (t !== null)
        while (t.getRight() !== null)
            t = t.getRight();
    return t;
};

BinarySearchTreeWithRank.prototype.findKthNode = function (k, t) {
    if (t === null)
        throw { name: "IllegalArgumentException", message: "Can't insert into an empty tree" };
    var leftSize = (t.getLeft() != null) ? t.getLeft().size : 0;

    if (k <= leftSize)
        return this.findKthNode(k, t.getLeft());
    if (k === leftSize + 1)
        return t;
    return this.findKthNode(k - leftSize - 1, t.getRight());
};

BinarySearchTreeWithRank.prototype.insertNode = function (x, t) {
    if (t === null)
        t = new BinaryNodeWithSize(x);
    else if (x - t.getElement() < 0)
        t.setLeft(this.insertNode(x, t.getLeft()));
    else if (x - t.getElement() > 0)
        t.setRight(this.insertNode(x, t.getRight()));
    else
        throw { name: "DuplicateItemException", message: "Can't insert duplicates" };
    t.size++;
    return t;
};

BinarySearchTreeWithRank.prototype.removeNode = function (x, t) {
    if (t === null)
        throw { name: "ItemNotFoundException", message: "Item was not found" };
    else if (x - t.getElement() < 0)
        t.setLeft(this.removeNode(x, t.getLeft()));
    else if (x - t.getElement() > 0)
        t.setRight(this.removeNode(x, t.getRight()));
    else if (t.getLeft() !== null && t.getRight() !== null) { // Two children
        t.setElement(this.findMinNode(t.getRight()).getElement());
        t.setRight(this.removeMinNode(t.getRight()));
    }
    else
        return (t.getLeft() !== null) ? t.getLeft() : t.getRight();

    t.size--;
    return t;
};

BinarySearchTreeWithRank.prototype.removeMinNode = function (t) {
    if (t === null)
        throw { name: "ItemNotFoundException", message: "Item was not found" };
    if (t.getLeft() === null)
        return t.getRight();

    t.setLeft(this.removeMinNode(t.getLeft()));
    t.size--;
    return t;
};