QUnit.module("Binary Heap tests");

QUnit.test("Initialize without data", function (assert) {
    var bh = new BinaryHeap();
    assert.deepEqual(bh.size(), 0, "Passed!");
});

QUnit.test("Initialize with data/collection", function (assert) {
    var bh = new BinaryHeap([4,8,2,3]);
    assert.deepEqual(bh.isEmpty(), false, "Passed!");
});

QUnit.test("Is empty", function (assert) {
    var bh = new BinaryHeap();
    assert.deepEqual(bh.isEmpty(), true, "Passed!");
});

QUnit.test("Add", function (assert) {
    var bh = new BinaryHeap();
    bh.add(1);
    bh.add(1);
    bh.add(1);
    assert.deepEqual(bh.isEmpty(), false, "Passed!");
});

QUnit.test("Remove", function (assert) {
    var bh = new BinaryHeap();
    bh.add(1);
    bh.add(1);
    bh.add(1);
    assert.deepEqual(bh.remove(), 1, "Passed!");
});

QUnit.test("Find min.", function (assert) {
    var bh = new BinaryHeap([7,3,1,5,6]);
    assert.deepEqual(bh.element(), 1, "Passed!");
});

QUnit.test("Check queue for right order", function (assert) {
    var bh = new BinaryHeap();
    bh.add(6);
    bh.add(1);
    bh.add(3);
    bh.add(4);
    bh.add(2);
    bh.add(5);
    assert.deepEqual(bh.toArrayAndEmpty(), [1,2,3,4,5,6], "Passed!");
});

QUnit.test("Alternating add and remove", function (assert) {
    var bh = new BinaryHeap();
    bh.add(6);
    bh.remove();
    bh.add(1);
    bh.add(3);
    bh.remove();
    bh.add(4);
    bh.add(2);
    bh.add(5);
    assert.deepEqual(bh.remove(), 2, "Passed!");
});