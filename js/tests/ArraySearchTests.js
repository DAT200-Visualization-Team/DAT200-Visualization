QUnit.module("Linear array search tests");

QUnit.test("Search linearly for item at index 0, unique element", function(assert){
    assert.deepEqual(linearSearch([0, 1, 2, 3, 4, 5], 0), 0, "Passed");
});

QUnit.test("Search linearly for item at index 2, unique element", function (assert) {
    assert.deepEqual(linearSearch([0, 1, 2, 3, 4, 5], 2), 2, "Passed");
});

QUnit.test("Search linearly for item at last index, unique element", function (assert) {
    assert.deepEqual(linearSearch([0, 1, 2, 3, 4, 5], 5), 5, "Passed");
});

QUnit.test("Search linearly for item at index 0, non-unique element", function (assert) {
    assert.deepEqual(linearSearch([0, 1, 2, 3, 0, 0], 0), 0, "Passed");
});

QUnit.test("Search linearly for item at index 2, non-unique element", function (assert) {
    assert.deepEqual(linearSearch([0, 1, 2, 3, 2, 2], 2), 2, "Passed");
});

QUnit.test("Search linearly for item that doesn't exist", function (assert) {
    assert.deepEqual(linearSearch([0, 1, 2, 3, 4, 5], 50), -1, "Passed");
});

QUnit.module("Binary array search tests");

QUnit.test("Search in a binary fashion for item at index 0, unique element", function (assert) {
    assert.deepEqual(binarySearch([0, 1, 2, 3, 4, 5], 0), 0, "Passed");
});

QUnit.test("Search in a binary fashion for item at index 2, unique element", function (assert) {
    assert.deepEqual(binarySearch([0, 1, 2, 3, 4, 5], 2), 2, "Passed");
});

QUnit.test("Search in a binary fashion for item at the last index, unique element", function (assert) {
    assert.deepEqual(binarySearch([0, 1, 2, 3, 4, 5], 5), 5, "Passed");
});

QUnit.test("Search in a binary fashion for item that doesn't exist", function (assert) {
    assert.deepEqual(binarySearch([0, 1, 2, 3, 4, 5], 50), -1, "Passed");
});