QUnit.module("Maximum Subsequence Sum tests");

QUnit.test("Test on array with only positive values", function (assert) {
    assert.deepEqual(maximumSubsequenceSum([5, 4, 3, 2, 1]), 15, "Passed!");
});

QUnit.test("Test on array with positive and negative values 1", function (assert) {
    assert.deepEqual(maximumSubsequenceSum([2, 3, -1, -20, 5, 10]), 15, "Passed");
});

QUnit.test("Test on array with positive and negative values 2", function (assert) {
    assert.deepEqual(maximumSubsequenceSum([6, -20, 1, 7, -2]), 8, "Passed");
});

QUnit.test("Test on array with only negative values", function (assert) {
    assert.deepEqual(maximumSubsequenceSum([-2, -3, -1, -20, -5, -10]), -1, "Passed");
});