QUnit.module("BinarySearchTreeWithRank tests");
QUnit.test("Make a new empty BinarySearchTreeWithRank, check if it is empty", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    assert.deepEqual(bstwr.isEmpty(), true, "Passed!");
});

QUnit.test("Insert one node into tree, check for not empty", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(5);
    assert.deepEqual(bstwr.isEmpty(), false, "Passed!");
});

QUnit.test("Insert one node into tree and check that it is min", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(5);
    assert.deepEqual(bstwr.findMin(), 5, "Passed!");
});

QUnit.test("Insert one node into tree and check that it is max", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(5);
    assert.deepEqual(bstwr.findMax(), 5, "Passed!");
});

QUnit.test("Insert one node into tree and check that it is found", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(5);
    assert.deepEqual(bstwr.find(5), 5, "Passed!");
});

QUnit.test("Insert one node into tree, remove it, and check that it is empty", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(5);
    bstwr.remove(5);
    assert.deepEqual(bstwr.isEmpty(), true, "Passed!");
});

QUnit.test("Insert one node into tree, make it empty, and check that it is empty", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(5);
    bstwr.makeEmpty();
    assert.deepEqual(bstwr.isEmpty(), true, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, find the min value", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(7);
    bstwr.insert(9);
    bstwr.insert(2);
    bstwr.insert(1);
    bstwr.insert(5);
    bstwr.insert(3);
    assert.deepEqual(bstwr.findMin(), 1, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, find the max value", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(7);
    bstwr.insert(9);
    bstwr.insert(2);
    bstwr.insert(1);
    bstwr.insert(5);
    bstwr.insert(3);
    assert.deepEqual(bstwr.findMax(), 9, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, find the node with value of 3", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(7);
    bstwr.insert(9);
    bstwr.insert(2);
    bstwr.insert(1);
    bstwr.insert(5);
    bstwr.insert(3);
    assert.deepEqual(bstwr.find(3), 3, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, check for correct root", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(7);
    bstwr.insert(9);
    bstwr.insert(2);
    bstwr.insert(1);
    bstwr.insert(5);
    bstwr.insert(3);
    assert.deepEqual(bstwr.root.getElement(), 7, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, check for correct root left", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(7);
    bstwr.insert(9);
    bstwr.insert(2);
    bstwr.insert(1);
    bstwr.insert(5);
    bstwr.insert(3);
    assert.deepEqual(bstwr.root.getLeft().getElement(), 2, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, check for correct root right", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(7);
    bstwr.insert(9);
    bstwr.insert(2);
    bstwr.insert(1);
    bstwr.insert(5);
    bstwr.insert(3);
    assert.deepEqual(bstwr.root.getRight().getElement(), 9, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, check for correct height", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(7);
    bstwr.insert(9);
    bstwr.insert(2);
    bstwr.insert(1);
    bstwr.insert(5);
    bstwr.insert(3);
    assert.deepEqual(binaryTreeHeight(bstwr.root), 3, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, check for correct size", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(7);
    bstwr.insert(9);
    bstwr.insert(2);
    bstwr.insert(1);
    bstwr.insert(5);
    bstwr.insert(3);
    assert.deepEqual(binaryTreeSize(bstwr.root), 6, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, remove one, check for correct height", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(7);
    bstwr.insert(9);
    bstwr.insert(2);
    bstwr.insert(1);
    bstwr.insert(5);
    bstwr.insert(3);
    bstwr.remove(5);
    assert.deepEqual(binaryTreeHeight(bstwr.root), 2, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, remove one, check for correct size", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(7);
    bstwr.insert(9);
    bstwr.insert(2);
    bstwr.insert(1);
    bstwr.insert(5);
    bstwr.insert(3);
    bstwr.remove(5);
    assert.deepEqual(binaryTreeSize(bstwr.root), 5, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, remove one, child of the parent for the removed node", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(7);
    bstwr.insert(9);
    bstwr.insert(2);
    bstwr.insert(1);
    bstwr.insert(5);
    bstwr.insert(3);
    bstwr.remove(5);
    assert.deepEqual(bstwr.root.getLeft().getRight().getElement(), 3, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, remove one, check that it can't be found", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(7);
    bstwr.insert(9);
    bstwr.insert(2);
    bstwr.insert(1);
    bstwr.insert(5);
    bstwr.insert(3);
    bstwr.remove(5);
    assert.deepEqual(bstwr.find(5), null, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, find the 2nd smallest", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(7);
    bstwr.insert(9);
    bstwr.insert(2);
    bstwr.insert(1);
    bstwr.insert(5);
    bstwr.insert(3);
    assert.deepEqual(bstwr.findKth(2), 2, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, find the 3rd smallest", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(7);
    bstwr.insert(9);
    bstwr.insert(2);
    bstwr.insert(1);
    bstwr.insert(5);
    bstwr.insert(3);
    assert.deepEqual(bstwr.findKth(3), 3, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, find the 4th smallest", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(7);
    bstwr.insert(9);
    bstwr.insert(2);
    bstwr.insert(1);
    bstwr.insert(5);
    bstwr.insert(3);
    assert.deepEqual(bstwr.findKth(4), 5, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, find the 5th smallest", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(7);
    bstwr.insert(9);
    bstwr.insert(2);
    bstwr.insert(1);
    bstwr.insert(5);
    bstwr.insert(3);
    assert.deepEqual(bstwr.findKth(5), 7, "Passed!");
});

QUnit.test("Make a tree with 6 nodes, find the 6th smallest", function (assert) {
    var bstwr = new BinarySearchTreeWithRank();
    bstwr.insert(7);
    bstwr.insert(9);
    bstwr.insert(2);
    bstwr.insert(1);
    bstwr.insert(5);
    bstwr.insert(3);
    assert.deepEqual(bstwr.findKth(6), 9, "Passed!");
});