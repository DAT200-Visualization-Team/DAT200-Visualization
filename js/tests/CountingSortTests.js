QUnit.module("Counting sort tests");

QUnit.test("Sort numbers", function (assert) {
    var array = [6, 4, 2, 7, 8, 2, 1, 7, 8];
    assert.deepEqual(countingSort(array, 9), [1, 2, 2, 4, 6, 7, 7, 8, 8], "Passed!");
});

QUnit.test("Sort empty array", function (assert) {
    var array = [];
    assert.deepEqual(countingSort(array, 0), [], "Passed!");
});