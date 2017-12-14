function BinaryNode(theElement, lt, rt) {
    this.element = null;
    this.left = null;
    this.right = null;

    if (theElement !== undefined)
        this.element = theElement;

    if (lt !== undefined && rt !== undefined) {
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

BinaryNode.prototype.getRight = function() {
    return this.right;
};

BinaryNode.prototype.setElement = function (x) {
    this.element = x;
};

BinaryNode.prototype.setLeft = function (t) {
    this.left = t;
    return this.left; //Added for the sake of visualization
};

BinaryNode.prototype.setRight = function (t) {
    this.right = t;
    return this.right; //Added for the sake of visualization
};

BinaryNode.prototype.duplicate = function () {
    var root = new BinaryNode(this.element, null, null);

    if (this.left != null)
        root.left = this.left.duplicate();
    if (this.right != null)
        root.right = this.right.duplicate();

    return root;
};

BinaryNode.prototype.printPreOrder = function () {
    console.log(this.element);
    if (this.left != null)
        this.left.printPreOrder();
    if (this.right != null)
        this.right.printPreOrder();
};

BinaryNode.prototype.printPostOrder = function () {
    if (this.left != null)
        this.left.printPostOrder();
    if (this.right != null)
        this.right.printPostOrder();
    console.log(this.element);
};

BinaryNode.prototype.printInOrder = function () {
    if (this.left != null)
        this.left.printInOrder();
    console.log(this.element);
    if (this.right != null)
        this.right.printInOrder();
};

BinaryNode.prototype.varString = function () {
    var element = this.element == null ? "null" : this.element.toString();
    var left = this.left == null ? "null" : this.left.element.toString();
    var right = this.right == null ? "null" : this.right.element.toString();
    return "Node: <br> &emsp; element: " + element + "<br> &emsp; left: " + left + "<br> &emsp; left: " + right;
}

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

function rotateWithLeftChild(k2) {
    var k1 = k2.left;
    k2.left = k1.right;
    k1.right = k2;
    return k1;
}

function rotateWithRightChild(k1) {
    var k2 = k1.right;
    k1.right = k2.left;
    k2.left = k1;
    return k2;
}

function doubleRotateWithLeftChild(k3) {
    k3.left = rotateWithRightChild(k3.left);
    return rotateWithLeftChild(k3);
}

function doubleRotateWithRightChild(k1) {
    k1.right = rotateWithLeftChild(k1.right);
    return rotateWithRightChild(k1);
}