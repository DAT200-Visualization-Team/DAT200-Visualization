QUnit.module("Array List tests");
QUnit.test("Initialize without data", function (assert) {
    var arrayList = new ArrayList();
    assert.equal(0, arrayList.size(), "Passed!");
});