var animationTime = 1;
var arr;
var tl = new TimelineMax();

function setArray(array) {
    if(array == null) arr = [5,18,2,3,82,9,1,4,7];
    else arr = array;

    $("#arraySearch").empty();
    for(var i = 0; i < arr.length; i++) {
        $("#arraySearch").append('<div class="entry"><h4 class="entry-value noselect">' + arr[i] + '</h4></div>')
    }
}

function visualizeLinearSearch(search) {
    for (var i = 0; i < arr.length; i++) {
        if(i != 0) tl.to($("#arraySearch").children().eq(i - 1), animationTime, {backgroundColor: "#cc6c6c"});
        tl.to($("#arraySearch").children().eq(i), animationTime, {backgroundColor: "#FFFF00"});
        if (arr[i] === search) {
            tl.to($("#arraySearch").children().eq(i), animationTime, {backgroundColor: "green"});
            return i;
        }
    }

    return -1;
}

function animate() {
    setArray();
    visualizeLinearSearch(9);
    tl.play();
}