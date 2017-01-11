QUnit.module("Linked List tests");

QUnit.test("Initialize without data", function (assert) {
    var linkedList = new LinkedList();
    assert.equal(0, linkedList.size(), "Passed!");
});

QUnit.test("Add", function(assert) {
    var linkedList = new LinkedList();
    linkedList.addFirst(3);
    linkedList.addFirst(2);
    linkedList.addFirst(1);
    assert.equal(linkedList.size(), 3, "Passed!");
});

QUnit.test("Add first", function(assert) {
    var linkedList = new LinkedList();
    linkedList.addFirst(3);
    linkedList.addFirst(2);
    linkedList.addFirst(1);
    assert.equal(linkedList.getNode(0).data, 1, "Passed!");
});

QUnit.test("Add last", function(assert) {
    var linkedList = new LinkedList();
    linkedList.addLast(1);
    linkedList.addLast(2);
    linkedList.addLast(3);
    assert.equal(linkedList.getNode(0).data, 1, "Passed!");
});

QUnit.test("Remove by index", function(assert) {
    var linkedList = new LinkedList();
    linkedList.addLast(1);
    linkedList.addLast(2);
    linkedList.addLast(3);
    linkedList.removeByIdx(1);
    assert.equal(linkedList.getNode(1).data, 3, "Passed!");
});

QUnit.test("Remove first", function(assert) {
    var linkedList = new LinkedList();
    linkedList.addLast(1);
    linkedList.addLast(2);
    linkedList.addLast(3);
    linkedList.removeFirst();
    assert.equal(linkedList.getNode(0).data, 2, "Passed!");
});

QUnit.test("Remove last", function(assert) {
    var linkedList = new LinkedList();
    linkedList.addLast(1);
    linkedList.addLast(2);
    linkedList.addLast(3);
    linkedList.removeLast();
    assert.equal(linkedList.getNode(linkedList.size() - 1).data, 2, "Passed!");
});

QUnit.test("Remove by data", function(assert) {
    var linkedList = new LinkedList();
    linkedList.addLast(1);
    linkedList.addLast(2);
    linkedList.addLast(3);
    assert.ok(linkedList.removeByData(1), true, "Passed!");
});

QUnit.test("Remove by invalid data", function(assert) {
    var linkedList = new LinkedList();
    linkedList.addLast(1);
    linkedList.addLast(2);
    linkedList.addLast(3);
    assert.equal(linkedList.removeByData(77), false, "Passed!");
});

QUnit.test("Set", function(assert) {
    var linkedList = new LinkedList();
    linkedList.addLast(1);
    linkedList.addLast(2);
    linkedList.addLast(3);
    linkedList.set(1, 77);
    assert.equal(linkedList.getNode(1).data, 77, "Passed!");
});

QUnit.test("Find position", function(assert) {
    var linkedList = new LinkedList();
    linkedList.addLast(1);
    linkedList.addLast(2);
    linkedList.addLast(3);
    linkedList.addLast(2);
    assert.equal(linkedList.findPos(2).data, linkedList.getNode(1).data, "Passed!");
});

QUnit.test("Find invalid position", function(assert) {
    var linkedList = new LinkedList();
    linkedList.addLast(1);
    linkedList.addLast(2);
    linkedList.addLast(3);
    assert.equal(linkedList.findPos(77), -1, "Passed!");
});

QUnit.test("To array", function(assert) {
    var array = [1,2,3];
    var linkedList = new LinkedList();
    linkedList.addLast(1);
    linkedList.addLast(2);
    linkedList.addLast(3);
    assert.deepEqual(linkedList.toArray(), array, "Passed!");
});


