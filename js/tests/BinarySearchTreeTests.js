QUnit.module("Binary Search Tree tests");
QUnit.test("Make a new empty Binary Search Tree", function (assert) {
    var bst = new BinarySearchTree();
    assert.deepEqual(bst.isEmpty(), true, "Passed!");
});

QUnit.test("Insert one node into tree and check for not empty", function (assert) {
    var bst = new BinarySearchTree();
    bst.insert(5);
    assert.deepEqual(bst.isEmpty(), false, "Passed!");
});

QUnit.test("Insert one node into tree and check that it is min", function (assert) {
    var bst = new BinarySearchTree();
    bst.insert(5);
    assert.deepEqual(bst.findMin(), 5, "Passed!");
});

QUnit.test("Insert one node into tree and check that it is max", function (assert) {
    var bst = new BinarySearchTree();
    bst.insert(5);
    assert.deepEqual(bst.findMax(), 5, "Passed!");
});

QUnit.test("Insert one node into tree and check that it is found", function (assert) {
    var bst = new BinarySearchTree();
    bst.insert(5);
    assert.deepEqual(bst.find(5), 5, "Passed!");
});

QUnit.test("Insert one node into tree, remove it, and check that it is empty", function (assert) {
    var bst = new BinarySearchTree();
    bst.insert(5);
    bst.remove(5);
    assert.deepEqual(bst.isEmpty(), true, "Passed!");
});

QUnit.test("Insert one node into tree, make it empty, and check that it is empty", function (assert) {
    var bst = new BinarySearchTree();
    bst.insert(5);
    bst.makeEmpty();
    assert.deepEqual(bst.isEmpty(), true, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, find the min value", function (assert) {
    var bst = new BinarySearchTree();
    bst.insert(7);
    bst.insert(9);
    bst.insert(2);
    bst.insert(1);
    bst.insert(5);
    bst.insert(3);
    assert.deepEqual(bst.findMin(), 1, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, find the max value", function (assert) {
    var bst = new BinarySearchTree();
    bst.insert(7);
    bst.insert(9);
    bst.insert(2);
    bst.insert(1);
    bst.insert(5);
    bst.insert(3);
    assert.deepEqual(bst.findMax(), 9, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, find the node with value of 3", function (assert) {
    var bst = new BinarySearchTree();
    bst.insert(7);
    bst.insert(9);
    bst.insert(2);
    bst.insert(1);
    bst.insert(5);
    bst.insert(3);
    assert.deepEqual(bst.find(3), 3, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, check for correct root", function (assert) {
    var bst = new BinarySearchTree();
    bst.insert(7);
    bst.insert(9);
    bst.insert(2);
    bst.insert(1);
    bst.insert(5);
    bst.insert(3);
    assert.deepEqual(bst.root.getElement(), 7, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, check for correct root left", function (assert) {
    var bst = new BinarySearchTree();
    bst.insert(7);
    bst.insert(9);
    bst.insert(2);
    bst.insert(1);
    bst.insert(5);
    bst.insert(3);
    assert.deepEqual(bst.root.getLeft().getElement(), 2, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, check for correct root right", function (assert) {
    var bst = new BinarySearchTree();
    bst.insert(7);
    bst.insert(9);
    bst.insert(2);
    bst.insert(1);
    bst.insert(5);
    bst.insert(3);
    assert.deepEqual(bst.root.getRight().getElement(), 9, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, check for correct root right", function (assert) {
    var bst = new BinarySearchTree();
    bst.insert(7);
    bst.insert(9);
    bst.insert(2);
    bst.insert(1);
    bst.insert(5);
    bst.insert(3);
    assert.deepEqual(bst.root.getRight().getElement(), 9, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, check for correct height", function (assert) {
    var bst = new BinarySearchTree();
    bst.insert(7);
    bst.insert(9);
    bst.insert(2);
    bst.insert(1);
    bst.insert(5);
    bst.insert(3);
    assert.deepEqual(binaryTreeHeight(bst.root), 3, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, check for correct size", function (assert) {
    var bst = new BinarySearchTree();
    bst.insert(7);
    bst.insert(9);
    bst.insert(2);
    bst.insert(1);
    bst.insert(5);
    bst.insert(3);
    assert.deepEqual(binaryTreeSize(bst.root), 6, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, remove one, check for correct height", function (assert) {
    var bst = new BinarySearchTree();
    bst.insert(7);
    bst.insert(9);
    bst.insert(2);
    bst.insert(1);
    bst.insert(5);
    bst.insert(3);
    bst.remove(5);
    assert.deepEqual(binaryTreeHeight(bst.root), 2, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, remove one, check for correct size", function (assert) {
    var bst = new BinarySearchTree();
    bst.insert(7);
    bst.insert(9);
    bst.insert(2);
    bst.insert(1);
    bst.insert(5);
    bst.insert(3);
    bst.remove(5);
    assert.deepEqual(binaryTreeSize(bst.root), 5, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, remove one, child of the parent for the removed node", function (assert) {
    var bst = new BinarySearchTree();
    bst.insert(7);
    bst.insert(9);
    bst.insert(2);
    bst.insert(1);
    bst.insert(5);
    bst.insert(3);
    bst.remove(5);
    assert.deepEqual(bst.root.getLeft().getRight().getElement(), 3, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, remove one, check that it can't be found", function (assert) {
    var bst = new BinarySearchTree();
    bst.insert(7);
    bst.insert(9);
    bst.insert(2);
    bst.insert(1);
    bst.insert(5);
    bst.insert(3);
    bst.remove(5);
    assert.deepEqual(bst.find(5), null, "Passed!");
});