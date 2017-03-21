QUnit.module("Graph tests");

QUnit.module("Dijkstra");

QUnit.test("Simple graph", function (assert) {
    var sg = new Graph();
    sg.addEdge("A", "B", 2);
    sg.addEdge("A", "C", 3);
    sg.addEdge("B", "C", 2);
    sg.addEdge("B", "D", 3);
    sg.addEdge("C", "D", 1);
    sg.dijkstra("A");
    assert.deepEqual(sg.getPath("D"), {A: 0, C: 3, D: 4}, "Passed!");
});

QUnit.test("Graph 1", function (assert) {
    var g = new Graph();
     g.addEdge("A", "B", 4);
     g.addEdge("A", "C", 2);
     g.addEdge("B", "C", 5);
     g.addEdge("B", "D", 10);
     g.addEdge("C", "E", 3);
     g.addEdge("E", "D", 4);
     g.addEdge("D", "F", 11);
     g.dijkstra("A");
     assert.deepEqual(g.getPath("F"), {A: 0, C: 2, E: 5, D: 9, F: 20}, "Passed!");
});

QUnit.test("Graph 2", function (assert) {
    var g2 = new Graph();
    g2.addEdge("A", "B", 25);
    g2.addEdge("A", "C", 35);
    g2.addEdge("B", "C", 15);
    g2.addEdge("C", "B", 50);
    g2.addEdge("B", "E", 90);
    g2.addEdge("C", "E", 30);
    g2.addEdge("C", "D", 50);
    g2.addEdge("D", "E", 60);
    g2.addEdge("E", "D", 10);
    g2.addEdge("E", "F", 70);
    g2.addEdge("D", "F", 20);
    g2.dijkstra("A");
    assert.deepEqual(g2.getPath("F"), {A: 0, C: 35, E: 65, D: 75, F: 95}, "Passed!");
});

QUnit.test("Graph 3", function (assert) {
    var g3 = new Graph();
    g3.addEdge("E", "B", 50);
    g3.addEdge("E", "G", 30);
    g3.addEdge("B", "F", 10);
    g3.addEdge("A", "B", 20);
    g3.addEdge("A", "G", 90);
    g3.addEdge("G", "A", 20);
    g3.addEdge("A", "D", 80);
    g3.addEdge("D", "G", 20);
    g3.addEdge("F", "C", 10);
    g3.addEdge("C", "F", 50);
    g3.addEdge("F", "D", 40);
    g3.addEdge("C", "D", 10);
    g3.addEdge("D", "C", 10);
    g3.addEdge("C", "H", 20);
    g3.dijkstra("A");
    assert.deepEqual(g3.getPath("H"), {A: 0, B: 20, F: 30, C: 40, H: 60}, "Passed!");
});

QUnit.test("Graph 4", function (assert) {
    var g4 = new Graph();
    g4.addEdge("A", "B", 5);
    g4.addEdge("A", "C", 3);
    g4.addEdge("B", "C", 2);
    g4.addEdge("B", "G", 1);
    g4.addEdge("B", "E", 3);
    g4.addEdge("C", "D", 7);
    g4.addEdge("C", "E", 7);
    g4.addEdge("D", "A", 2);
    g4.addEdge("D", "F", 6);
    g4.addEdge("E", "D", 2);
    g4.addEdge("E", "F", 1);
    g4.addEdge("G", "E", 1);
    g4.dijkstra("A");
    assert.deepEqual(g4.getPath("F"), {A: 0, B: 5, G: 6, E: 7, F: 8}, "Passed!");
});

QUnit.module("Bellman-Ford");

QUnit.test("Simple graph", function (assert) {
    var sg = new Graph();
    sg.addEdge("A", "B", 2);
    sg.addEdge("A", "C", 3);
    sg.addEdge("B", "C", 2);
    sg.addEdge("B", "D", 3);
    sg.addEdge("C", "D", 1);
    sg.negative("A");
    assert.deepEqual(sg.getPath("D"), {A: 0, C: 3, D: 4}, "Passed!");
});

QUnit.test("Graph 1", function (assert) {
    var g = new Graph();
    g.addEdge("A", "B", 4);
    g.addEdge("A", "C", 2);
    g.addEdge("B", "C", 5);
    g.addEdge("B", "D", 10);
    g.addEdge("C", "E", 3);
    g.addEdge("E", "D", 4);
    g.addEdge("D", "F", 11);
    g.negative("A");
    assert.deepEqual(g.getPath("F"), {A: 0, C: 2, E: 5, D: 9, F: 20}, "Passed!");
});

QUnit.test("Graph 2", function (assert) {
    var g2 = new Graph();
    g2.addEdge("A", "B", 25);
    g2.addEdge("A", "C", 35);
    g2.addEdge("B", "C", 15);
    g2.addEdge("C", "B", 50);
    g2.addEdge("B", "E", 90);
    g2.addEdge("C", "E", 30);
    g2.addEdge("C", "D", 50);
    g2.addEdge("D", "E", 60);
    g2.addEdge("E", "D", 10);
    g2.addEdge("E", "F", 70);
    g2.addEdge("D", "F", 20);
    g2.negative("A");
    assert.deepEqual(g2.getPath("F"), {A: 0, C: 35, E: 65, D: 75, F: 95}, "Passed!");
});

QUnit.test("Graph 3", function (assert) {
    var g3 = new Graph();
    g3.addEdge("E", "B", 50);
    g3.addEdge("E", "G", 30);
    g3.addEdge("B", "F", 10);
    g3.addEdge("A", "B", 20);
    g3.addEdge("A", "G", 90);
    g3.addEdge("G", "A", 20);
    g3.addEdge("A", "D", 80);
    g3.addEdge("D", "G", 20);
    g3.addEdge("F", "C", 10);
    g3.addEdge("C", "F", 50);
    g3.addEdge("F", "D", 40);
    g3.addEdge("C", "D", 10);
    g3.addEdge("D", "C", 10);
    g3.addEdge("C", "H", 20);
    g3.negative("A");
    assert.deepEqual(g3.getPath("H"), {A: 0, B: 20, F: 30, C: 40, H: 60}, "Passed!");
});

QUnit.test("Graph 4", function (assert) {
    var g4 = new Graph();
    g4.addEdge("A", "B", 5);
    g4.addEdge("A", "C", 3);
    g4.addEdge("B", "C", 2);
    g4.addEdge("B", "G", 1);
    g4.addEdge("B", "E", 3);
    g4.addEdge("C", "D", 7);
    g4.addEdge("C", "E", 7);
    g4.addEdge("D", "A", 2);
    g4.addEdge("D", "F", 6);
    g4.addEdge("E", "D", 2);
    g4.addEdge("E", "F", 1);
    g4.addEdge("G", "E", 1);
    g4.negative("A");
    assert.deepEqual(g4.getPath("F"), {A: 0, B: 5, G: 6, E: 7, F: 8}, "Passed!");
});

QUnit.test("Graph with negative edge", function (assert) {
    var gne = new Graph();
    gne.addEdge("A", "B", 2);
    gne.addEdge("B", "C", 1);
    gne.addEdge("B", "D", 2);
    gne.addEdge("C", "E", 3);
    gne.addEdge("D", "C", -4);
    gne.negative("A");
    assert.deepEqual(gne.getPath("E"), {A: 0, B: 2, D: 4, C: 0, E: 3}, "Passed!");
});

