var data = [3,2,1];

var barWidth = 40;
var width = (barWidth + 10) * data.length;
var height = 300;

var code = d3.select("#code-text");
var barChart = d3.select(".drawingArea").append("svg:svg").attr("id", "barChart");

var rects = barChart.append("svg:g").selectAll("rect");
var texts = barChart.append("svg:g").selectAll("text");

//Animation
var animationTime = 1;
var tl = new TimelineMax();

createArray(data);

function createArray(array) {
    $('g').empty();
    data = array;
    width = (barWidth + 10) * data.length;

    barChart.attr("width", width)
    .attr("height", height);

    rects = rects.data(data);
    texts = texts.data(data);

    var r = rects.enter();

    r.append("rect")
        .attr("x", function (d, index) { return index * (width / data.length); })
        .attr("y", function (d) { return height - (d/Math.max.apply(null, data)) * 250 - 20; })
        .attr("height", function (d) { return d / Math.max.apply(null, data) * 250; })
        .attr("width", barWidth)
        .attr("class", function (d, i) { return "element" + i })
        .attr("fill", function (d) { return "rgb(" + (d * 3) + ", 0, 0)"; });

    var t = texts.enter();

    t.append("text").text(function (d) { return d; })
        .attr("x", function (d, index) { return index * (width / data.length) + barWidth / 4; })
        .attr("y", height)
        .attr("width", barWidth)
        .attr("class", function (d, i) { return "element" + i });
}

function swap(a, b) {
    console.log("swap " + a + " with " + b);
    var elementA = $(".element" + a);
    var elementB = $(".element" + b);

    console.log(elementA);
    console.log(elementB);

    var oldRectA_X = a * (width / data.length);
    var oldTextA_X = a * (width / data.length) + barWidth / 4;

    var oldRectB_X = b * (width / data.length);
    var oldTextB_X = b * (width / data.length) + barWidth / 4;

    var dxA = oldRectA_X - oldRectB_X;
    var dxB = oldRectB_X - oldRectA_X;

/*    tl//.addLabel('swap')
        .set(elementA.filter("rect"), {attr:{class: "element" + b}})
        .set(elementA.filter("text"), {attr:{class: "element" + b}})
        .set(elementB.filter("rect"), {attr:{class: "element" + a}})
        .set(elementB.filter("text"), {attr:{class: "element" + a}});*/
    //tl.to(elementA.filter("rect"), 0, {attr:{class: "element" + b}, ease:Linear.easeNone})
    //    .to(elementA.filter("text"), 0, {attr:{class: "element" + b}, ease:Linear.easeNone})
    //    .to(elementB.filter("rect"), 0, {attr:{class: "element" + a}, ease:Linear.easeNone})
    //    .to(elementB.filter("text"), 0, {attr:{class: "element" + a}, ease:Linear.easeNone})
    //    .to(elementA.filter("rect"), animationTime, {attr:{x:oldRectB_X}, ease:Linear.easeNone})
    //    .to(elementA.filter("text"), animationTime, {attr:{x:oldTextB_X}, ease:Linear.easeNone}, '-=1')
    //    .to(elementB.filter("rect"), animationTime, {attr:{x:oldRectA_X}, ease:Linear.easeNone}, '-=1')
    //    .to(elementB.filter("text"), animationTime, {attr:{x:oldTextA_X}, ease:Linear.easeNone}, '-=1');
    tl.to(elementA, animationTime, { x: '-=' + dxA})
        .to(elementB, animationTime, { x: '-=' + dxB }, '-=' + animationTime);
    elementA.attr('class', 'element' + b);
    elementB.attr('class', 'element' + a);
}

function startSorting() {
    sort();
}

function sort() {
    bubbleSort(data.slice());
}

