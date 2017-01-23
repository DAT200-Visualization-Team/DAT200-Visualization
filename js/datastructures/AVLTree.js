function AVLTree() {
    this.root = null;
}

AVLTree.prototype.insert = function (x) {
    this.root = this.insertNode(x, this.root);
};

AVLTree.prototype.remove = function (x) {
    this.root = this.removeNode(x, this.root);
};

AVLTree.prototype.removeMin = function () {
    this.root = this.removeMinNode(this.root);
};

AVLTree.prototype.findMin = function () {
    return this.elementAt(this.findMinNode(this.root));
};

AVLTree.prototype.findMax = function () {
    return this.elementAt(this.findMaxNode(this.root));
};

AVLTree.prototype.find = function (x) {
    return this.elementAt(this.findNode(x, this.root));
};

AVLTree.prototype.makeEmpty = function () {
    this.root = null;
};

AVLTree.prototype.isEmpty = function () {
    return this.root == null;
};

AVLTree.prototype.elementAt = function (t) {
    return t === null ? null : t.getElement();
};

AVLTree.prototype.findNode = function (x, t) {
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

AVLTree.prototype.findMinNode = function (t) {
    if (t !== null)
        while (t.getLeft() !== null)
            t = t.getLeft();
    return t;
};

AVLTree.prototype.findMaxNode = function (t) {
    if (t !== null)
        while (t.getRight() !== null)
            t = t.getRight();
    return t;
};

AVLTree.prototype.insertNode = function (x, t) {
    if (t === null)
        t = new BinaryNode(x);
    else if (x - t.getElement() < 0)
        t.setLeft(this.insertNode(x, t.getLeft()));
    else if (x - t.getElement() > 0)
        t.setRight(this.insertNode(x, t.getRight()));
    else
        throw { name: "DuplicateItemException", message: "Duplicate items are not allowed" };

    var balanceDelta = this.getBalance(t);

    // Left rotate
    if (balanceDelta > 1 && x < t.left.getElement())
        return rotateWithRightChild(t);
    
    // Right rotate
    if (balanceDelta < -1 && x > t.right.getElement())
        return rotateWithLeftChild(t);

    // Left Right rotate
    if (balanceDelta > 1 && x > t.left.getElement())
        return doubleRotateWithLeftChild(t);

    // Right Left rotate
    if (balanceDelta < -1 && x < t.right.getElement())
        return doubleRotateWithRightChild(t);

    return t;
};

AVLTree.prototype.removeMinNode = function (t) {
    if (t === null)
        throw { name: "ItemNotFoundException", message: "The item was not found" };
    else if (t.getLeft() !== null) {
        t.setLeft(this.removeMinNode(t.getLeft()));
        return t;
    }
    else
        return t.getRight();
};

AVLTree.prototype.removeNode = function (x, t) {
    if (t === null)
        throw { name: "ItemNotFoundException", message: "The item was not found" };
    if (x - t.getElement() < 0)
        t.setLeft(this.removeNode(x, t.getLeft()));
    else if (x - t.getElement() > 0)
        t.setRight(this.removeNode(x, t.getRight()));
    else if (t.getLeft() !== null && t.getRight() !== null) { // Two children
        t.setElement(this.findMinNode(t.getRight()).getElement());
        t.setRight(this.removeMinNode(t.getRight()));
    }
    else
        t = (t.getLeft() !== null) ? t.getLeft() : t.getRight();

    var balanceDelta = this.getBalance(t);

    // Left Rotate
    if (balanceDelta > 1 && this.getBalance(t.left) >= 0)
        return rotateWithRightChild(t);

    // Right rotate
    if (balanceDelta < -1 && this.getBalance(t.right) <= 0)
        return rotateWithLeftChild(t);

    // Left Right rotate
    if (balanceDelta > 1 && this.getBalance(t.left) < 0)
        return doubleRotateWithLeftChild(t);

    // Right Left rotate
    if (balanceDelta < -1 && this.getBalance(t.right) > 0)
        return doubleRotateWithRightChild(t);

    return t;
};

AVLTree.prototype.getBalance = function (t) {
    return t != null ? binaryTreeHeight(t.left) - binaryTreeHeight(t.right) : 0;
}