QUnit.module("Array List tests");
QUnit.test("Initialize without data", function (assert) {
    var arrayList = new ArrayList();
    assert.deepEqual(arrayList.size(), 0, "Passed!");
});

QUnit.test("Initialize with array", function (assert) {
    var arrayList = new ArrayList([5, 1, 6, 3, 7, 5]); // Length of 6
    assert.deepEqual(arrayList.size(), 6, "Passed!");
});

QUnit.test("Insert into empty ArrayList", function (assert) {
    var arrayList = new ArrayList();
    arrayList.add(5);
    assert.deepEqual(arrayList.get(0), 5, "Passed!");
});

QUnit.test("Insert into prepopulated ArrayList, see element at the end of ArrayList", function (assert) {
    var arrayList = new ArrayList([6, 2, 3, 7]);
    arrayList.add(22);
    assert.deepEqual(arrayList.get(arrayList.size() - 1), 22, "Passed!");
});

QUnit.test("Clear array", function (assert) {
    var arrayList = new ArrayList([2, 6, 1, 5]);
    arrayList.clear();
    assert.deepEqual(arrayList.size(), 0, "Passed!");
});

QUnit.test("Change value in index", function (assert) {
    var arrayList = new ArrayList([5, 2, 5]);
    arrayList.set(0, 200);
    assert.deepEqual(arrayList.get(0), 200, "Passed!");
});

QUnit.test("Find index of data", function (assert) {
    var arrayList = new ArrayList([5, 2, 5]);
    assert.deepEqual(arrayList.findPos(2), 1, "Passed!");
});

QUnit.test("Find index of data with duplicate values", function (assert) {
    var arrayList = new ArrayList([5, 2, 5]);
    assert.deepEqual(arrayList.findPos(5), 0, "Passed!");
});

QUnit.test("Check if it contains value when it does", function (assert) {
    var arrayList = new ArrayList([5, 2, 5]);
    assert.deepEqual(arrayList.contains(2), true, "Passed!");
});

QUnit.test("Check if it contains value when it does not", function (assert) {
    var arrayList = new ArrayList([5, 2, 5]);
    assert.deepEqual(arrayList.contains(5000), false, "Passed!");
});

QUnit.test("Remove an element when there is only one, check boolean", function (assert) {
    var arrayList = new ArrayList([5, 2, 5]);
    assert.deepEqual(arrayList.remove(2), true, "Passed!");
});

QUnit.test("Remove an element when it does not exist, check boolean", function (assert) {
    var arrayList = new ArrayList([5, 2, 5]);
    assert.deepEqual(arrayList.remove(200), false, "Passed!");
});

QUnit.test("Remove an element when there is only one, check size", function (assert) {
    var arrayList = new ArrayList([5, 2, 5]);
    arrayList.remove(2);
    assert.deepEqual(arrayList.size(), 2, "Passed!");
});

QUnit.test("Remove an element when there are multiple, check size", function (assert) {
    var arrayList = new ArrayList([5, 2, 5]);
    arrayList.remove(5);
    assert.deepEqual(arrayList.size(), 2, "Passed!");
});

QUnit.test("Remove an element when it does not exist, check size", function (assert) {
    var arrayList = new ArrayList([5, 2, 5]);
    arrayList.remove(200);
    assert.deepEqual(arrayList.size(), 3, "Passed!");
});

QUnit.test("Remove an element by index when there is only one, check returned element", function (assert) {
    var arrayList = new ArrayList([5, 2, 5]);
    assert.deepEqual(arrayList.removeAtPos(2), 5, "Passed!");
});

QUnit.test("Remove an element by index when there is only one, check size", function (assert) {
    var arrayList = new ArrayList([5, 2, 5]);
    arrayList.removeAtPos(1);
    assert.deepEqual(arrayList.size(), 2, "Passed!");
});

QUnit.test("Remove an element when there are multiple, check size", function (assert) {
    var arrayList = new ArrayList([5, 2, 5]);
    arrayList.removeAtPos(2);
    assert.deepEqual(arrayList.size(), 2, "Passed!");
});

QUnit.module("Array List iterator");
QUnit.test("Go to first element in ArrayList when list is empty", function (assert) {
    var arrayList = new ArrayList();
    var it = arrayList.iterator();
    assert.deepEqual(it.next().done, true, "Passed!");
});

QUnit.test("Go to first element in ArrayList when list is not empty, check done", function (assert) {
    var arrayList = new ArrayList([5]);
    var it = arrayList.iterator();
    assert.deepEqual(it.next().done, false, "Passed!");
});

QUnit.test("Go to first element in ArrayList when list is not empty, check value", function (assert) {
    var arrayList = new ArrayList([5]);
    var it = arrayList.iterator();
    assert.deepEqual(it.next().value, 5, "Passed!");
});

QUnit.test("Go to index 2, go back to index 0", function (assert) {
    var arrayList = new ArrayList([0, 1, 2]);
    var it = arrayList.iterator();
    it.next();
    it.next();
    it.previous();
    assert.deepEqual(it.previous().value, 0, "Passed!");
});

QUnit.test("Remove middle element, check size of ArrayList", function (assert) {
    var arrayList = new ArrayList([0, 1, 2]);
    var it = arrayList.iterator();
    it.next();
    it.next();
    it.remove();
    assert.deepEqual(arrayList.size(), 2, "Passed!");
});

QUnit.test("Remove middle element, check that next is the last element", function (assert) {
    var arrayList = new ArrayList([0, 1, 2]);
    var it = arrayList.iterator();
    it.next();
    it.next();
    it.remove();
    assert.deepEqual(it.next().value, 2, "Passed!");
});