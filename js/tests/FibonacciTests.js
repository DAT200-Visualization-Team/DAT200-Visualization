QUnit.module("Fibonacci tests");

QUnit.test("Test first 20 values(naive)", function (assert) {
    var expected = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765];

    for (var i = 1; i <= expected.length; i++)
        assert.deepEqual(naiveFib(i), expected[i - 1], "Passed!");
});

QUnit.test("Test first 20 values(iterative)", function (assert) {
    var expected = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765];

    for (var i = 1; i <= expected.length; i++)
        assert.deepEqual(iterativeFib(i), expected[i - 1], "Passed!");
});

QUnit.test("Test first 20 values(dynamic)", function (assert) {
    var expected = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765];

    for (var i = 1; i <= expected.length; i++)
        assert.deepEqual(new FibCalculator(i).getResult(), expected[i - 1], "Passed!");
});