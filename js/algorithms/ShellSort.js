function shellSort(a) {
    codeDisplayManager.setVariable("a", "[" + a.join(", ") + "]");
    codeDisplayManager.setVariable("length", a.length);
    highlightCode([0]);
    for(var gap = parseInt(a.length / 2); gap > 0;
        gap = gap === 2 ? 1 : parseInt(gap / 2.2)) {
        updateVariable("gap", gap.toString());
        sublist(gap);

        highlightCode([3]);
        for (var i = gap; i < a.length; i++) {
            updateVariable("i", i.toString());
            var tmp = a[i];
            highlightCode([4]);
            updateVariable("tmp", tmp.toString());

            highlightCode([5]);

            for (var j = i; j >= gap && highlight(j, j - gap, null, null, 6) && tmp < a[j - gap]; j -= gap) {
                updateVariable("j", j.toString());
                a[j] = a[j - gap];
                swap(j - gap, j, 7);
                updateVariable("a", "[" + a.join(", ") + "]");
                clearAllHighlight();
            }
            clearAllHighlight();
            highlightCode([10])
            a[j] = tmp;
            updateVariable("a", "[" + a.join(", ") + "]");
        }
        mergeSublists();
        highlightCode([0]);
    }

    highlightCode([14]);
    return a;
}