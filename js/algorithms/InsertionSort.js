function insertionSort(a) {
    //Commands for GUI
    var commands = [];

    for(var p = 1; p < a.length; p++) {
        var tmp = a[p];
        var j = p;

        for(; j > 0 && commands.push("highlight( " + p + ", " + (j - 1) + ")") && tmp < a[j - 1]; j--) {
            //commands.push("highlightCompare(j, j-1)");
            a[j] = a[j - 1];

            //GUI
            //console.log("swap(" + j + ", " + (j - 1) + ");");
            commands.push("swap(" + j + ", " + (j - 1) + ");");
        }
        a[j] = tmp;
    }

    //Send commands to GUI
    console.log(commands);
    $(document).trigger("sort", commands.join('!'));

    return a;
}
