QUnit.module("Expression Tree tests");

QUnit.test("Basic addition", function (assert) {
    var et = new ExpressionTree();
    var root = et.constructTree("32+");
    assert.deepEqual(et.inOrder(root), "3 + 2", "Passed!")
});

QUnit.test("Basic subtraction", function (assert) {
    var et = new ExpressionTree();
    var root = et.constructTree("32-");
    assert.deepEqual(et.inOrder(root), "3 - 2", "Passed!")
});

QUnit.test("Basic multiplication", function (assert) {
    var et = new ExpressionTree();
    var root = et.constructTree("32*");
    assert.deepEqual(et.inOrder(root), "3 * 2", "Passed!")
});

QUnit.test("Basic division", function (assert) {
    var et = new ExpressionTree();
    var root = et.constructTree("32/");
    assert.deepEqual(et.inOrder(root), "3 / 2", "Passed!")
});

QUnit.test("Basic exponentiation", function (assert) {
    var et = new ExpressionTree();
    var root = et.constructTree("32^");
    assert.deepEqual(et.inOrder(root), "3 ^ 2", "Passed!")
});

QUnit.test("Basic modulo", function (assert) {
    var et = new ExpressionTree();
    var root = et.constructTree("32%");
    assert.deepEqual(et.inOrder(root), "3 % 2", "Passed!")
});

QUnit.test("More complex expression", function (assert) {
    var et = new ExpressionTree();
    var root = et.constructTree("ab+ef*g*-");
    assert.deepEqual(et.inOrder(root), "a + b - e * f * g", "Passed!")
});