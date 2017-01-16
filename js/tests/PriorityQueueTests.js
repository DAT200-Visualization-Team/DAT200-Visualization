QUnit.module("PriorityQueue tests");

QUnit.test("Initialize without data", function (assert) {
    var pq = new PriorityQueue();
    assert.deepEqual(pq.isEmpty(), true, "Passed!");
});

QUnit.test("Enqueue", function (assert) {
    var pq = new PriorityQueue();
    pq.enqueue(3, 3);
    pq.enqueue(2, 2);
    pq.enqueue(1, 1);
    assert.deepEqual(pq.isEmpty(), false, "Passed!");
});

QUnit.test("Enqueue and get front", function (assert) {
    pq.makeEmpty();
    pq.enqueue("3", 3);
    pq.enqueue("2", 2);
    pq.enqueue("1", 1);
    pq.enqueue("7", 7);
    pq.enqueue("-1", -1);
    pq.enqueue("4",4);
    assert.deepEqual(pq.getFront().job, "7", "Passed!");
});

QUnit.test("Dequeue", function (assert) {
    pq.makeEmpty();
    pq.enqueue(3, 3);
    pq.enqueue(2, 2);
    pq.enqueue(1, 1);
    pq.enqueue(7, 7);
    pq.enqueue(-1, -1);
    pq.enqueue(4, 4);
    assert.deepEqual(pq.dequeue().job, 7, "Passed!");
});

QUnit.test("Multiple dequeue", function (assert) {
    pq.makeEmpty();
    pq.enqueue(3, 3);
    pq.enqueue(2, 2);
    pq.enqueue(1, 1);
    pq.enqueue(7, 7);
    pq.enqueue(-1, -1);
    pq.enqueue(4, 4);
    pq.dequeue();
    pq.dequeue();
    assert.deepEqual(pq.dequeue().job, 3, "Passed!");
});

QUnit.test("Make empty", function (assert) {
    var pq = new PriorityQueue();
    pq.enqueue(3, 3);
    pq.enqueue(2, 2);
    pq.enqueue(1, 1);
    pq.makeEmpty();
    assert.deepEqual(pq.isEmpty(), true, "Passed!");
});
