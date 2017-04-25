var animationTime = 1000;


function setArray(arr) {
    if(arr == null) {
        arr = [5,18,2,3,82,9,1,4,7];
    }
    $("#arraySearchWrapper").empty();
    for(var i = 0; i < arr.length; i++) {
        $("#arraySearchWrapper").append('<div class="entry"><h4 class="entry-value noselect">' + arr[i] + '</h4></div>')
    }
}

function visualizeLinearSearch(array, search) {
    for (var i = 0; i < array.length; i++)
        if (array[i] === search) return i;

    return -1;
}