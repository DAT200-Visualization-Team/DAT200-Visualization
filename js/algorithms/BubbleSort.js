function bubbleSort(array) {
    var commands = [];
    var n = array.length;
    while(n > 0) {
        var newN = 0;
        for (var i = 1; i < n; i++) {
            commands.push("highlight(" + (i-1) + ", " + i + ");");
            if (array[i - 1] > array[i]) {
                var tmp = array[i];
                array[i] = array[i - 1];
                array[i - 1] = tmp;
                commands.push("swap(" + i + ", " + (i-1) + ");");
                newN = i;
            }
        }
        n = newN;
        commands.push("markAsSorted(" + newN + ");");
    }

    $(document).trigger("sort", commands.join('!'));

    return array;
}
