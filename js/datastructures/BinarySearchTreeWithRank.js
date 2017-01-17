function BinarySearchTreeWithRank() {
    BinarySearchTree.call(this);
}

BinarySearchTreeWithRank.prototype = Object.create(BinarySearchTree, {
    constructor: {
        configurable: true,
        enimerable: true,
        value: BinarySearchTreeWithRank,
        writable: true
    }
});

BinarySearchTreeWithRank.prototype.findKth = function (k) {
    return this.findKthNode(k, this.root).getElement();
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