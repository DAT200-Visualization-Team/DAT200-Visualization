QUnit.module("Shell sort tests");

QUnit.test("Sort numbers", function (assert) {
    var array = [6,4,2,7,8,2,1,7,8];
    assert.deepEqual(shellSort(array), [1,2,2,4,6,7,7,8,8], "Passed!");
});

QUnit.test("Sort strings", function (assert) {
    var array = ["f","c", "b", "d", "a", "e"];
    assert.deepEqual(shellSort(array), ["a", "b", "c", "d", "e", "f"], "Passed!");
});

QUnit.test("Sort empty array", function (assert) {
    var array = [];
    assert.deepEqual(shellSort(array), [], "Passed!");
});
