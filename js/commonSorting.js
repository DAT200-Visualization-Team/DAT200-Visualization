function swap(a, b) {
    var elementA = $(".element" + a);
    var elementB = $(".element" + b);

    var oldRectA_X = a * (width / data.length);
    var oldTextA_X = a * (width / data.length) + barWidth / 4;

    var oldRectB_X = b * (width / data.length);
    var oldTextB_X = b * (width / data.length) + barWidth / 4;

    var dxA = oldRectA_X - oldRectB_X;
    var dxB = oldRectB_X - oldRectA_X;

    tl.to(elementA, animationTime, { x: '-=' + dxA})
        .to(elementB, animationTime, { x: '-=' + dxB }, '-=' + animationTime);
    elementA.attr('class', 'element' + b);
    elementB.attr('class', 'element' + a);
}

function highlight(a, b, colorA, colorB) {
    colorA = colorA || "#87CEFA";
    colorB = colorB || "#87CEFA";

    var elementA = $(".element" + a).filter("rect");
    var elementB = $(".element" + b).filter("rect");

    tl.addLabel('highlight')
        .to(elementA.filter("rect"), animationTime, {attr:{fill: colorA}, ease:Linear.easeNone}, 'highlight')
        .to(elementB.filter("rect"), animationTime, {attr:{fill: colorB}, ease:Linear.easeNone}, 'highlight');

    return true;
}

function clearHighlight(element, origColor) {
    origColor = origColor || "red";
    tl.to($(".element" + element).filter("rect"), animationTime, {attr:{fill: origColor}, ease:Linear.easeNone});
}

function markAsSorted(a) {
    console.log("mark as sorted" + a);
    var selector = ".element" + a;
    if(a == 0) selector = "*";
    var element = $(selector).filter("rect");

    tl.to(element, animationTime, {attr:{fill: "purple", class: element.attr('class') + " sorted"}, ease:Linear.easeNone})
}
