function BinaryNodeWithSize(theElement, lt, rt) {
    this.element = null;
    this.left = null;
    this.right = null;
    this.size = 0;

    if (theElement !== undefined)
        this.element = theElement;

    if (lt !== undefined && rt !== undefined) {
        this.left = lt;
        this.right = rt;
    }
}

BinaryNodeWithSize.prototype.getElement = function () {
    return this.element;
};

BinaryNodeWithSize.prototype.getLeft = function () {
    return this.left;
};

BinaryNodeWithSize.prototype.getRight = function () {
    return this.right;
};

BinaryNodeWithSize.prototype.setElement = function (x) {
    this.element = x;
};

BinaryNodeWithSize.prototype.setLeft = function (t) {
    this.left = t;
};

BinaryNodeWithSize.prototype.setRight = function (t) {
    this.right = t;
};

BinaryNodeWithSize.prototype.duplicate = function () {
    var root = new BinaryNodeWithSize(this.element, null, null);

    if (this.left != null)
        root.left = this.left.duplicate();
    if (this.right != null)
        root.right = this.right.duplicate();

    return root;
};

BinaryNodeWithSize.prototype.printPreOrder = function () {
    console.log(this.element);
    if (this.left != null)
        this.left.printPreOrder()
    if (this.right != null)
        this.right.printPreOrder();
};

BinaryNodeWithSize.prototype.printPostOrder = function () {
    if (this.left != null)
        this.left.printPostOrder()
    if (this.right != null)
        this.right.printPostOrder();
    console.log(this.element);
};

BinaryNodeWithSize.prototype.printInOrder = function () {
    if (this.left != null)
        this.left.printInOrder()
    console.log(this.element);
    if (this.right != null)
        this.right.printInOrder();
};