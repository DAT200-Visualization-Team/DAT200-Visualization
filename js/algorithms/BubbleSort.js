function bubbleSort(array) {
    codeDisplayManager.setVariable("array", "[" + array.join(", ") + "]")
    codeDisplayManager.setVariable("length", array.length)
    var n = array.length;
    highlightCode([0])
    updateVariable("n", n.toString());
    highlightCode([1])
    while (n > 0) {
        highlightCode([2]);
        var newN = 0;
        updateVariable("newN", newN.toString());
        highlightCode([3]);
        for (var i = 1; i < n; i++) {
            updateVariable("i", i.toString());
            highlight(i - 1, i);
            highlightCode([4]);
            if (array[i - 1] > array[i]) {
                highlightCode([5]);
                var tmp = array[i];
                updateVariable("tmp", tmp.toString());
                highlightCode([6]);
                array[i] = array[i - 1];
                updateVariable("array", "[" + array.join(", ") + "]");
                array[i - 1] = tmp;
                swap(i, i - 1, 7);
                updateVariable("array", "[" + array.join(", ") + "]");
                highlightCode([8]);
                newN = i;
                updateVariable("newN", newN.toString());
            }
            clearHighlight(i-1);
        }
        n = newN;
        updateVariable("n", n.toString());
        highlightCode([11]);
        markAsSorted(newN);
        highlightCode([1]);
    }

    highlightCode([14]);
    return array;
}
