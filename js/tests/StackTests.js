QUnit.module("Stack tests")
QUnit.test("Create new empty stack, verify it is empty", function (assert) {
    var stack = new Stack();
    assert.deepEqual(stack.isEmpty(), true, "Passed!");
});

QUnit.test("Push to stack, verify it is not empty", function (assert) {
    var stack = new Stack();
    stack.push(122);
    assert.deepEqual(stack.isEmpty(), false, "Passed!");
});

QUnit.test("Push to stack, verify expected value using top to peek", function (assert) {
    var stack = new Stack();
    stack.push(122);
    assert.deepEqual(stack.top(), 122, "Passed!");
});

QUnit.test("Push to stack, pop and verify it is empty", function (assert) {
    var stack = new Stack();
    stack.push(122);
    stack.pop();
    assert.deepEqual(stack.isEmpty(), true, "Passed!");
});

QUnit.test("Push multiple to stack, pop and verify you get the previous value", function (assert) {
    var stack = new Stack();
    stack.push(1);
    stack.push(2);
    stack.push(3);
    stack.pop();
    assert.deepEqual(stack.top(), 2, "Passed!");
});

QUnit.test("Push multiple to stack, make empty and verify it is empty", function (assert) {
    var stack = new Stack();
    stack.push(1);
    stack.push(2);
    stack.push(3);
    stack.makeEmpty();
    assert.deepEqual(stack.isEmpty(), true, "Passed!");
});