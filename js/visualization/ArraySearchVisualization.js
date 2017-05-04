var animationTime = 1000;
var arr;
var loadingSequence = [];

function setArray(array) {
    if(array == null) arr = [5,18,2,3,82,9,1,4,7];
    else arr = array;

    $("#arraySearch").empty();
    for(var i = 0; i < arr.length; i++) {
        $("#arraySearch").append('<div class="entry"><h4 class="entry-value noselect">' + arr[i] + '</h4></div>')
    }
    $("#arraySearch").append('<div id="arrow-up"></div>')

}

function visualizeLinearSearch(search) {
    for (var i = 0; i < arr.length; i++) {
        // TODO: move arrow
        loadingSequence.push({e: $("#arrow-up"), p: {translateX: "4rm"}, o: {duration: animationTime}})
        if (arr[i] === search) {
            // TODO: mark entry
            return i;
        }
    }


    return -1;
}

function animate() {
    $.Velocity.RunSequence(loadingSequence);
}