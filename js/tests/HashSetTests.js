QUnit.module("Hash Set tests");
QUnit.test("Create new empty HashSet, verify it is empty", function (assert) {
    var hashSet = new HashSet();
    assert.deepEqual(hashSet.size(), 0, "Passed!");
});

QUnit.test("Create new HashSet from array, verify it is not empty", function (assert) {
    var hashSet = new HashSet([0,1,2,3]);
    assert.deepEqual(hashSet.size(), 4, "Passed!");
});

QUnit.test("Clear HashSet, verify it is empty", function (assert) {
    var hashSet = new HashSet([0, 1, 2, 3]);
    hashSet.clear();
    assert.deepEqual(hashSet.size(), 0, "Passed!");
});

QUnit.test("Check return value of contains when the element exists", function (assert) {
    var hashSet = new HashSet([0, 1, 2, 3]);
    assert.deepEqual(hashSet.contains(2), true, "Passed!");
});

QUnit.test("Check return value of contains when the element does not exist", function (assert) {
    var hashSet = new HashSet([0, 1, 2, 3]);
    assert.deepEqual(hashSet.contains(500), false, "Passed!");
});

QUnit.test("Find match in hash set", function (assert) {
    var hashSet = new HashSet([0, 1, 2, 3]);
    assert.deepEqual(hashSet.getMatch(2), 2, "Passed!");
});

QUnit.test("Find match for non-existing object in hash set", function (assert) {
    var hashSet = new HashSet([0, 1, 2, 3]);
    assert.deepEqual(hashSet.getMatch(2), 2, "Passed!");
});

QUnit.test("Add element and verify new size", function (assert) {
    var hashSet = new HashSet([0, 1, 2, 3]);
    hashSet.add(4);
    assert.deepEqual(hashSet.size(), 5, "Passed!");
});

QUnit.test("Add existing element and verify new size", function (assert) {
    var hashSet = new HashSet([0, 1, 2, 3]);
    hashSet.add(2);
    assert.deepEqual(hashSet.size(), 4, "Passed!");
});

QUnit.test("Add existing element and verify new size", function (assert) {
    var hashSet = new HashSet([0, 1, 2, 3]);
    assert.deepEqual(hashSet.add(2), false, "Passed!");
});

QUnit.test("Remove element and verify new size", function (assert) {
    var hashSet = new HashSet([0, 1, 2, 3]);
    hashSet.remove(3);
    assert.deepEqual(hashSet.size(), 3, "Passed!");
});

QUnit.test("Remove element and verify return value", function (assert) {
    var hashSet = new HashSet([0, 1, 2, 3]);
    assert.deepEqual(hashSet.remove(3), true, "Passed!");
});

QUnit.test("Remove non-existing element and verify new size", function (assert) {
    var hashSet = new HashSet([0, 1, 2, 3]);
    hashSet.remove(55);
    assert.deepEqual(hashSet.size(), 4, "Passed!");
});

QUnit.test("Remove non-existing element and verify new size", function (assert) {
    var hashSet = new HashSet([0, 1, 2, 3]);
    assert.deepEqual(hashSet.remove(55), false, "Passed!");
});

QUnit.module("Hash Set Iterator tests");
QUnit.test("Check that first iterator element has next", function (assert) {
    var hashSet = new HashSet([0, 1, 2, 3]);
    var it = hashSet.iterator();
    assert.deepEqual(it.hasNext(), true, "Passed!");
});

QUnit.test("Check that second to last iterator element has next", function (assert) {
    var hashSet = new HashSet([0, 1, 2, 3]);
    var it = hashSet.iterator();
    it.next();
    it.next();
    assert.deepEqual(it.hasNext(), true, "Passed!");
});

QUnit.test("Check that last iterator element does not have next", function (assert) {
    var hashSet = new HashSet([0, 1, 2, 3]);
    var it = hashSet.iterator();
    it.next();
    it.next();
    it.next();
    it.next();
    assert.deepEqual(it.hasNext(), false, "Passed!");
});

QUnit.test("Check that first iterator element is correct", function (assert) {
    var hashSet = new HashSet([0, 1, 2, 3]);
    var it = hashSet.iterator();
    assert.deepEqual(it.next(), 0, "Passed!");
});

QUnit.test("Check that last iterator element is correct", function (assert) {
    var hashSet = new HashSet([0, 1, 2, 3]);
    var it = hashSet.iterator();
    it.next();
    it.next();
    it.next();
    assert.deepEqual(it.next(), 3, "Passed!");
});

QUnit.test("Try removing element in iterator and verify size", function (assert) {
    var hashSet = new HashSet([0, 1, 2, 3]);
    var it = hashSet.iterator();
    it.next();
    it.remove()
    assert.deepEqual(hashSet.size(), 3, "Passed!");
});

QUnit.test("Try removing element in iterator and confirm it is not there anymore", function (assert) {
    var hashSet = new HashSet([0, 1, 2, 3]);
    var it = hashSet.iterator();
    it.next();
    it.remove()
    assert.deepEqual(hashSet.contains(0), false, "Passed!");
});
