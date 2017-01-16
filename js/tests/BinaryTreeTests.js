QUnit.module("Binary Tree tests");
QUnit.test("Make empty tree, verify using size", function (assert) {
    var bt = new BinaryTree();
    assert.deepEqual(bt.size(), 0, "Passed!");
});

QUnit.test("Make empty tree, verify using size", function (assert) {
    var bt = new BinaryTree();
    assert.deepEqual(bt.isEmpty(), true, "Passed!");
});

QUnit.test("Make empty tree, verify using height", function (assert) {
    var bt = new BinaryTree();
    assert.deepEqual(bt.height(), -1, "Passed!");
});

QUnit.test("Make new tree with root node, verify using size", function (assert) {
    var bt = new BinaryTree(1);
    assert.deepEqual(bt.size(), 1, "Passed!");
});

QUnit.test("Make new tree with root node, verify using isEmpty", function (assert) {
    var bt = new BinaryTree(1);
    assert.deepEqual(bt.isEmpty(), false, "Passed!");
});

QUnit.test("Make new tree with root node, verify using height", function (assert) {
    var bt = new BinaryTree(1);
    assert.deepEqual(bt.height(), 0, "Passed!");
});

QUnit.test("Make new tree with root node, verify using getRoot", function (assert) {
    var bt = new BinaryTree(1);
    var root = bt.getRoot();
    assert.deepEqual(root.getElement(), 1, "Passed!");
});

QUnit.test("Make new tree with root node, make it empty and verify", function (assert) {
    var bt = new BinaryTree(1);
    bt.makeEmpty();
    assert.deepEqual(bt.size(), 0, "Passed!");
});

QUnit.test("Add two nodes to the root, verify size", function (assert) {
    var bt = new BinaryTree(1);
    bt.getRoot().setLeft(new BinaryNode(2, null, null));
    bt.getRoot().setRight(new BinaryNode(3, null, null));
    assert.deepEqual(bt.size(), 3, "Passed!");
});

QUnit.test("Add two nodes to the root, verify height", function (assert) {
    var bt = new BinaryTree(1);
    bt.getRoot().setLeft(new BinaryNode(2, null, null));
    bt.getRoot().setRight(new BinaryNode(3, null, null));
    assert.deepEqual(bt.height(), 1, "Passed!");
});

QUnit.test("Add two nodes to the root, verify left node value", function (assert) {
    var bt = new BinaryTree(1);
    bt.getRoot().setLeft(new BinaryNode(2, null, null));
    bt.getRoot().setRight(new BinaryNode(3, null, null));
    assert.deepEqual(bt.getRoot().getLeft().getElement(), 2, "Passed!");
});

QUnit.test("Add two nodes to the root, verify right node value", function (assert) {
    var bt = new BinaryTree(1);
    bt.getRoot().setLeft(new BinaryNode(2, null, null));
    bt.getRoot().setRight(new BinaryNode(3, null, null));
    assert.deepEqual(bt.getRoot().getRight().getElement(), 3, "Passed!");
});

QUnit.test("Add two nodes to the root, duplicate the root and verify they are equal", function (assert) {
    var bt = new BinaryTree(1);
    bt.getRoot().setLeft(new BinaryNode(2, null, null));
    bt.getRoot().setRight(new BinaryNode(3, null, null));
    assert.deepEqual(bt.getRoot().duplicate(), bt.getRoot(), "Passed!");
});

QUnit.module("Binary Tree Iterator tests Post order");
QUnit.test("Traverse to first element in Post order", function (assert) {
    var bt = new BinaryTree(1);
    bt.getRoot().setLeft(new BinaryNode(2, null, null));
    bt.getRoot().setRight(new BinaryNode(3, null, null));

    var ti = new TreeIterator(bt);
    var it = ti.postOrderIterator();
    it.first();
    assert.deepEqual(ti.retrieve(), 2, "Passed!");
});

QUnit.test("Traverse to second element in Post order", function (assert) {
    var bt = new BinaryTree(1);
    bt.getRoot().setLeft(new BinaryNode(2, null, null));
    bt.getRoot().setRight(new BinaryNode(3, null, null));

    var ti = new TreeIterator(bt);
    var it = ti.postOrderIterator();
    it.first();
    it.advance();
    assert.deepEqual(ti.retrieve(), 3, "Passed!");
});

QUnit.test("Traverse to third element in Post order", function (assert) {
    var bt = new BinaryTree(1);
    bt.getRoot().setLeft(new BinaryNode(2, null, null));
    bt.getRoot().setRight(new BinaryNode(3, null, null));

    var ti = new TreeIterator(bt);
    var it = ti.postOrderIterator();
    it.first();
    it.advance();
    it.advance();
    assert.deepEqual(ti.retrieve(), 1, "Passed!");
});

QUnit.module("Binary Tree Iterator tests In order");
QUnit.test("Traverse to first element in In order", function (assert) {
    var bt = new BinaryTree(1);
    bt.getRoot().setLeft(new BinaryNode(2, null, null));
    bt.getRoot().setRight(new BinaryNode(3, null, null));

    var ti = new TreeIterator(bt);
    var it = ti.inOrderIterator();
    it.first();
    assert.deepEqual(ti.retrieve(), 2, "Passed!");
});

QUnit.test("Traverse to second element in In order", function (assert) {
    var bt = new BinaryTree(1);
    bt.getRoot().setLeft(new BinaryNode(2, null, null));
    bt.getRoot().setRight(new BinaryNode(3, null, null));

    var ti = new TreeIterator(bt);
    var it = ti.inOrderIterator();
    it.first();
    it.advance();
    assert.deepEqual(ti.retrieve(), 1, "Passed!");
});

QUnit.test("Traverse to third element in In order", function (assert) {
    var bt = new BinaryTree(1);
    bt.getRoot().setLeft(new BinaryNode(2, null, null));
    bt.getRoot().setRight(new BinaryNode(3, null, null));

    var ti = new TreeIterator(bt);
    var it = ti.inOrderIterator();
    it.first();
    it.advance();
    it.advance();
    assert.deepEqual(ti.retrieve(), 3, "Passed!");
});

QUnit.module("Binary Tree Iterator tests Pre order");
QUnit.test("Traverse to first element in Pre order", function (assert) {
    var bt = new BinaryTree(1);
    bt.getRoot().setLeft(new BinaryNode(2, null, null));
    bt.getRoot().setRight(new BinaryNode(3, null, null));

    var ti = new TreeIterator(bt);
    var it = ti.preOrderIterator();
    it.first();
    assert.deepEqual(ti.retrieve(), 1, "Passed!");
});

QUnit.test("Traverse to second element in Pre order", function (assert) {
    var bt = new BinaryTree(1);
    bt.getRoot().setLeft(new BinaryNode(2, null, null));
    bt.getRoot().setRight(new BinaryNode(3, null, null));

    var ti = new TreeIterator(bt);
    var it = ti.preOrderIterator();
    it.first();
    it.advance();
    assert.deepEqual(ti.retrieve(), 2, "Passed!");
});

QUnit.test("Traverse to third element in Pre order", function (assert) {
    var bt = new BinaryTree(1);
    bt.getRoot().setLeft(new BinaryNode(2, null, null));
    bt.getRoot().setRight(new BinaryNode(3, null, null));

    var ti = new TreeIterator(bt);
    var it = ti.preOrderIterator();
    it.first();
    it.advance();
    it.advance();
    assert.deepEqual(ti.retrieve(), 3, "Passed!");
});

QUnit.module("Binary Tree Iterator tests Level order");
QUnit.test("Traverse to first element in Level order", function (assert) {
    var bt = new BinaryTree(1);
    bt.getRoot().setLeft(new BinaryNode(2, null, null));
    bt.getRoot().setRight(new BinaryNode(3, null, null));

    var ti = new TreeIterator(bt);
    var it = ti.levelOrderIterator();
    it.first();
    assert.deepEqual(ti.retrieve(), 1, "Passed!");
});

QUnit.test("Traverse to second element in Level order", function (assert) {
    var bt = new BinaryTree(1);
    bt.getRoot().setLeft(new BinaryNode(2, null, null));
    bt.getRoot().setRight(new BinaryNode(3, null, null));

    var ti = new TreeIterator(bt);
    var it = ti.levelOrderIterator();
    it.first();
    it.advance();
    assert.deepEqual(ti.retrieve(), 2, "Passed!");
});

QUnit.test("Traverse to third element in Level order", function (assert) {
    var bt = new BinaryTree(1);
    bt.getRoot().setLeft(new BinaryNode(2, null, null));
    bt.getRoot().setRight(new BinaryNode(3, null, null));

    var ti = new TreeIterator(bt);
    var it = ti.levelOrderIterator();
    it.first();
    it.advance();
    it.advance();
    assert.deepEqual(ti.retrieve(), 3, "Passed!");
});