/*function swap(a, b) {
    console.log("swap " + a + " with " + b);
    var elementA = $(".element" + a);
    var elementB = $(".element" + b);

    var oldRectA_X = elementA.filter("rect").attr('x');
    var oldTextA_X = elementA.filter("text").attr('x');

    tl//.addLabel('swap')
        .set(elementA.filter("rect"), {attr:{class: "element" + b}})
        .set(elementA.filter("text"), {attr:{class: "element" + b}})
        .set(elementB.filter("rect"), {attr:{class: "element" + a}})
        .set(elementB.filter("text"), {attr:{class: "element" + a}})
        .to(elementA.filter("rect"), animationTime, {attr:{x:elementB.filter('rect').attr('x'), class: "element" + b}, ease:Linear.easeNone})
        .to(elementA.filter("text"), animationTime, {attr:{x:elementB.filter('text').attr('x'), class: "element" + b}, ease:Linear.easeNone}, '-=1')
        .to(elementB.filter("rect"), animationTime, {attr:{x:oldRectA_X, class: "element" + a}, ease:Linear.easeNone}, '-=1')
        .to(elementB.filter("text"), animationTime, {attr:{x:oldTextA_X, class: "element" + a}, ease:Linear.easeNone}, '-=1');
}*/

function highlight(a, b, colorA, colorB) {
    colorA = colorA || "blue";
    colorB = colorB || "green";

    var elementA = $(".element" + a).filter("rect");
    var elementB = $(".element" + b).filter("rect");

    tl.addLabel('highlight')
        .to(elementA.filter("rect"), animationTime, {attr:{fill: colorA}, ease:Linear.easeNone}, 'highlight')
        .to(elementB.filter("rect"), animationTime, {attr:{fill: colorB}, ease:Linear.easeNone}, 'highlight');

    return true;
}

function markAsSorted(a) {
    console.log("mark as sorted" + a);
    var selector = ".element" + a;
    if(a == 0) selector = "*";
    var element = $(selector).filter("rect");

    tl.to(element, animationTime, {attr:{fill: "purple", class: element.attr('class') + " sorted"}, ease:Linear.easeNone})
}
