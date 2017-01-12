function BinaryNode(theElement, lt, rt) {
    this.element = null;
    this.left = null;
    this.right = null;

    if (theElement !== undefined && left !== undefined && right !== undefined) {
        this.element = theElement;
        this.left = lt;
        this.right = rt;
    }
}

BinaryNode.prototype.getElement = function () {
    return this.element;
};

BinaryNode.prototype.getLeft = function () {
    return this.left;
};

BinaryNode.prototype.getRight = function(){
    return this.right;
};

BinaryNode.prototype.setElement = function (x) {
    this.element = x;
};

BinaryNode.prototype.setLeft = function (t) {
    this.left = t;
};

BinaryNode.prototype.setRight = function (t) {
    this.right = t;
};

BinaryNode.prototype.duplicate = function () {
    var root = new BinaryNode(this.element, null, null);

    if (this.left != null)
        root.left = this.left.duplicate();
    if (this.right != null)
        root.right = this.right.duplicate();

    return root;
};

function binaryTreeSize(t) {
    if (t == null)
        return 0;
    else
        return 1 + binaryTreeSize(t.left) + binaryTreeSize(t.right);
}

function binaryTreeHeight(t) {
    if (t == null)
        return -1;
    else
        return 1 + Math.max(binaryTreeHeight(t.left), binaryTreeHeight(t.right))
}

