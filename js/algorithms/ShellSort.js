// Shell sort

function shellSort(a) {

    for(var gap = a.length / 2; gap > 0;
        gap = gap === 2 ? 1 : parseInt(gap / 2.2)) {
        //commands.push("sublist(" + gap + ")");
        sublist(gap);

        for(var i = gap; i < a.length; i++) {
            var tmp = a[i];

            for(var j = i; j >= gap && highlight(i, j-gap)/*&& commands.push("highlight(" + i + ", " + (j - gap) + ")") */ && tmp < a[j - gap]; j-= gap) {
                a[j] = a[j - gap];
                //commands.push("swap(" + (j - gap) + ", " + j + ")");
                //commands.push("clearHighlight()");
                swap(j-gap, j);
                clearAllHighlight();
            }
            clearAllHighlight();
            //commands.push("clearHighlight()");
            a[j] = tmp;
        }
        mergeSublists();
        //commands.push("mergeSublists()");
    }

    //$(document).trigger("sort", commands.join('!'));
    //console.log(a);
    return a;
}