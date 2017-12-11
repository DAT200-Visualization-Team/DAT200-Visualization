function insertionSort(a) {
	highlightCode([0]);
	codeDisplayManager.setVariable("a", "[" + a.join(", ") + "]");

	for (var p = 1; p < a.length; p++) {
		updateVariable("p", p.toString());
        var tmp = a[p];
        var j = p;
		highlightCode([1]);
		updateVariable("tmp", tmp.toString());
		highlightCode([2]);
		updateVariable("j", j.toString());
		for (; j > 0 && highlight(j, j - 1, null, null, 4) && tmp < a[j - 1]; j--) {
			updateVariable("j", j.toString());
            a[j] = a[j - 1];

			swap(j, j - 1, 5);
			clearAllHighlight();
			updateVariable("a", "[" + a.join(", ") + "]");
        }
		a[j] = tmp;
		highlightCode([8]);
		updateVariable("a", "[" + a.join(", ") + "]");
        clearAllHighlight();
        highlightCode([0]);
    }

    highlightCode([11]);
    return a;
}
