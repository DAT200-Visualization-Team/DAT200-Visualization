// ONLY works for numbers
function countingSort(array, maxValue) {
    codeDisplayManager.setVariable("array", "[" + array.join(", ") + "]");
    codeDisplayManager.setVariable("maxValue", maxValue.toString());
    highlightCode([0]);

    if (array.constructor !== Array || array.length == 0) {
        highlightCode([1]);
        return [];
    }

    highlightCode([3]);
    var valueCount = Array.apply(null, Array(maxValue)).map(Number.prototype.valueOf, 0);
    updateVariable("valueCount", "[" + valueCount.join(", ") + "]")
    highlightCode([4, 6]);
    var value;

    for (var i = 0; i < array.length; i++) {
        updateVariable("i", i.toString());
        highlightCode([7]);
        value = array[i];
        updateVariable("value", value.toString());

        highlight(i, "#unsortedArray");

        valueCount[value] += 1;

        countUpdate(value);
        updateVariable("valueCount", "[" + valueCount.join() + "]");
        clearHighlight("#countingArray");
        highlightCode([6]);
    }

    highlightCode([11]);
    var result = new Array(array.list);
    updateVariable("result", "[" + result.join(", ") + "]")
    highlightCode([12]);
    var index = 0;
    updateVariable("index", index.toString());
    highlightCode([13]);
    for (var i = 0; i < valueCount.length; i++) {
        updateVariable("i", i.toString());
        highlightCode([14]);
        for (var j = 0; j < valueCount[i]; j++) {
            updateVariable("j", j.toString());
            result[index] = i;
            sortedUpdate(index, i);
            updateVariable("result", "[" + result.join(", ") + "]")
            highlightCode([16]);
            index++;
            updateVariable("index", index.toString());
            highlightCode([14]);
        }
        highlightCode([13]);
    }

    highlightCode([20]);
    clearHighlight("#countingArray");
    clearHighlight("#sortedArray");
    return result;
}
