function insertionSort(a) {
    //Commands for GUI
    var commands = [];

    for(var p = 1; p < a.length; p++) {
        commands.push("codeLineHighlight(2)");
        var tmp = a[p];
        commands.push("codeLineHighlight(3)");
        var j = p;
        commands.push("codeLineHighlight(4)");

        for(; j > 0 && commands.push("highlight( " + j + ", " + (j - 1) + ")") && tmp < a[j - 1]; j--) {
            a[j] = a[j - 1];

            //GUI
            commands.push("swap(" + j + ", " + (j - 1) + ");");
        }
        a[j] = tmp;
        commands.push("codeLineHighlight(8)");
    }

    commands.push("codeLineHighlight(10)");

    //Send commands to GUI
    console.log(commands);
    $(document).trigger("sort", commands.join('!'));

    return a;
}
