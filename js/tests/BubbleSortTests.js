QUnit.module("Bubble Sort tests");

QUnit.test("Test an array of integers, no duplicates", function (assert) {
    var array = [5, 2, 6, 3, 1];
    assert.deepEqual(bubbleSort(array), [1, 2, 3, 5, 6], "Passed!");
});

QUnit.test("Test an array of integers, with duplicates", function (assert) {
    var array = [5, 2, 6, 3, 1, 1, 0, 5, 2];
    assert.deepEqual(bubbleSort(array), [0, 1, 1, 2, 2, 3, 5, 5, 6], "Passed!");
});

QUnit.test("Test an array of strings, no duplicates", function (assert) {
    var array = ['b', 'f', 'a', 'c', 'e', 'd'];
    assert.deepEqual(bubbleSort(array), ['a', 'b', 'c', 'd', 'e', 'f'], "Passed!");
});

QUnit.test("Test an array of strings, no duplicates", function (assert) {
    var array = ['b', 'a', 'a', 'c', 'b', 'd', 'd', 'b'];
    assert.deepEqual(bubbleSort(array), ['a', 'a', 'b', 'b', 'b', 'c', 'd', 'd'], "Passed!");
});