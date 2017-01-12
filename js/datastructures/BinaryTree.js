function BinaryTree(rootItem) {
    this.root = null;

    if (rootItem !== undefined)
        this.root = new BinaryNode(rootItem, null, null);
}

BinaryTree.prototype.getRoot = function () {
    return this.root;
};

BinaryTree.prototype.size = function () {
    return binaryTreeSize(this.root);
};

BinaryTree.prototype.height = function () {
    return binaryTreeHeight(this.root);
};

BinaryTree.prototype.printPreOrder = function () {
    if (this.root != null)
        this.root.printPreOrder();
};

BinaryTree.prototype.printPostOrder = function () {
    if (this.root != null)
        this.root.printPostOrder();
};

BinaryTree.prototype.printInOrder = function () {
    if (this.root != null)
        this.root.printInOrder();
};

BinaryTree.prototype.makeEmpty = function () {
    this.root = null;
};

BinaryTree.prototype.isEmpty = function () {
    return this.root == null;
};

BinaryTree.prototype.merge = function (rootItem, t1, t2) {
    if (t1.root == t2.root && t1.root != null)
        throw { name: "IllegalArgumentException", message: "Can't merge two trees with the same root" };

    // Allocate new node
    this.root = new BinaryNode(rootItem, t1.root, t2.root);

    if (this != t1)
        t1.root = null;
    if (this != t2)
        t2.root = null;
};