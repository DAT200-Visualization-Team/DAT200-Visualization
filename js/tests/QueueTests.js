QUnit.module("Queue tests");

QUnit.test("Initialize without data", function (assert) {
    var q = new Queue();
    assert.deepEqual(q.isEmpty(), true, "Passed!");
});

QUnit.test("Enqueue", function (assert) {
    var q = new Queue();
    q.enqueue(3);
    q.enqueue(2);
    q.enqueue(1);
    assert.deepEqual(q.isEmpty(), false, "Passed!");
});

QUnit.test("Enqueue and get front", function (assert) {
    var q = new Queue();
    q.enqueue(3);
    q.enqueue(2);
    q.enqueue(1);
    assert.deepEqual(q.getFront(), 3, "Passed!");
});

QUnit.test("Dequeue", function (assert) {
    var q = new Queue();
    q.enqueue(3);
    q.enqueue(2);
    q.enqueue(1);
    q.dequeue();
    assert.deepEqual(q.dequeue(), 2, "Passed!");
});

QUnit.test("Make empty", function (assert) {
    var q = new Queue();
    q.enqueue(3);
    q.enqueue(2);
    q.enqueue(1);
    q.makeEmpty();
    assert.deepEqual(q.isEmpty(), true, "Passed!");
});
