QUnit.module("AVLTree tests");
QUnit.test("Make a new empty AVLTree, check if it is empty", function (assert) {
    var avlt = new AVLTree();
    assert.deepEqual(avlt.isEmpty(), true, "Passed!");
});

QUnit.test("Insert one node into tree, check for not empty", function (assert) {
    var avlt = new AVLTree();
    avlt.insert(5);
    assert.deepEqual(avlt.isEmpty(), false, "Passed!");
});

QUnit.test("Insert one node into tree and check that it is min", function (assert) {
    var avlt = new AVLTree();
    avlt.insert(5);
    assert.deepEqual(avlt.findMin(), 5, "Passed!");
});

QUnit.test("Insert one node into tree and check that it is max", function (assert) {
    var avlt = new AVLTree();
    avlt.insert(5);
    assert.deepEqual(avlt.findMax(), 5, "Passed!");
});

QUnit.test("Insert one node into tree and check that it is found", function (assert) {
    var avlt = new AVLTree();
    avlt.insert(5);
    assert.deepEqual(avlt.find(5), 5, "Passed!");
});

QUnit.test("Insert one node into tree, remove it, and check that it is empty", function (assert) {
    var avlt = new AVLTree();
    avlt.insert(5);
    avlt.remove(5);
    assert.deepEqual(avlt.isEmpty(), true, "Passed!");
});

QUnit.test("Insert one node into tree, make it empty, and check that it is empty", function (assert) {
    var avlt = new AVLTree();
    avlt.insert(5);
    avlt.makeEmpty();
    assert.deepEqual(avlt.isEmpty(), true, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, find the min value", function (assert) {
    var avlt = new AVLTree();
    avlt.insert(7);
    avlt.insert(9);
    avlt.insert(2);
    avlt.insert(1);
    avlt.insert(5);
    avlt.insert(3);
    assert.deepEqual(avlt.findMin(), 1, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, find the max value", function (assert) {
    var avlt = new AVLTree();
    avlt.insert(7);
    avlt.insert(9);
    avlt.insert(2);
    avlt.insert(1);
    avlt.insert(5);
    avlt.insert(3);
    assert.deepEqual(avlt.findMax(), 9, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, find the node with value of 3", function (assert) {
    var avlt = new AVLTree();
    avlt.insert(7);
    avlt.insert(9);
    avlt.insert(2);
    avlt.insert(1);
    avlt.insert(5);
    avlt.insert(3);
    assert.deepEqual(avlt.find(3), 3, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, check for correct root", function (assert) {
    var avlt = new AVLTree();
    avlt.insert(7);
    avlt.insert(9);
    avlt.insert(2);
    avlt.insert(1);
    avlt.insert(5);
    avlt.insert(3);
    assert.deepEqual(avlt.root.getElement(), 5, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, check for correct root left", function (assert) {
    var avlt = new AVLTree();
    avlt.insert(7);
    avlt.insert(9);
    avlt.insert(2);
    avlt.insert(1);
    avlt.insert(5);
    avlt.insert(3);
    assert.deepEqual(avlt.root.getLeft().getElement(), 2, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, check for correct root right", function (assert) {
    var avlt = new AVLTree();
    avlt.insert(7);
    avlt.insert(9);
    avlt.insert(2);
    avlt.insert(1);
    avlt.insert(5);
    avlt.insert(3);
    assert.deepEqual(avlt.root.getRight().getElement(), 7, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, check for correct height", function (assert) {
    var avlt = new AVLTree();
    avlt.insert(7);
    avlt.insert(9);
    avlt.insert(2);
    avlt.insert(1);
    avlt.insert(5);
    avlt.insert(3);
    assert.deepEqual(binaryTreeHeight(avlt.root), 2, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, check for correct size", function (assert) {
    var avlt = new AVLTree();
    avlt.insert(7);
    avlt.insert(9);
    avlt.insert(2);
    avlt.insert(1);
    avlt.insert(5);
    avlt.insert(3);
    assert.deepEqual(binaryTreeSize(avlt.root), 6, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, remove one, check for correct height", function (assert) {
    var avlt = new AVLTree();
    avlt.insert(7);
    avlt.insert(9);
    avlt.insert(2);
    avlt.insert(1);
    avlt.insert(5);
    avlt.insert(3);
    avlt.remove(5);
    assert.deepEqual(binaryTreeHeight(avlt.root), 2, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, remove one, check for correct size", function (assert) {
    var avlt = new AVLTree();
    avlt.insert(7);
    avlt.insert(9);
    avlt.insert(2);
    avlt.insert(1);
    avlt.insert(5);
    avlt.insert(3);
    avlt.remove(5);
    assert.deepEqual(binaryTreeSize(avlt.root), 5, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, remove one, child of the parent for the removed node", function (assert) {
    var avlt = new AVLTree();
    avlt.insert(7);
    avlt.insert(9);
    avlt.insert(2);
    avlt.insert(1);
    avlt.insert(5);
    avlt.insert(3);
    avlt.remove(5);
    assert.deepEqual(avlt.root.getLeft().getRight().getElement(), 3, "Passed!");
});