function swap(a, b, line) {
    console.log("swap", a, b);

    var elementA = $(".element" + a);
    var elementB = $(".element" + b);

    var oldRectA_X = a * (width / data.length);
    var oldTextA_X = a * (width / data.length) + barWidth / 4;

    var oldRectB_X = b * (width / data.length);
    var oldTextB_X = b * (width / data.length) + barWidth / 4;

    var dxA = oldRectA_X - oldRectB_X;
    var dxB = oldRectB_X - oldRectA_X;

    appendAnimation(line, [{ e: elementA, p: { x: '-=' + dxA }, o: { duration: 1 }},
    { e: elementB, p: { x: '-=' + dxB }, o: { duration: 1, position: '-=1' } }], codeDisplayManager);

    elementA.attr('class', 'element' + b);
    elementB.attr('class', 'element' + a);
}

function highlight(a, b, colorA, colorB, line) {
    colorA = colorA || "#87CEFA";
    colorB = colorB || "#87CEFA";

    var elementA = $(".element" + a).filter("rect");
    var elementB = $(".element" + b).filter("rect");

    appendAnimation(line, [{ e: elementA, p: { attr: { fill: colorA } }, o: { duration: 1 } },
        { e: elementB, p: { attr: { fill: colorB } }, o: { duration: 1, position: '-=1' } }], codeDisplayManager);

    return true;
}

function clearHighlight(element, origColor) {
    origColor = origColor || "red";
    appendAnimation(null, [{ e: $('.element' + element).filter('rect'), p: { attr: { fill: origColor } }, o: { duration: 1 } }], null);
}

function markAsSorted(a, line) {
    var selector = ".element" + a;
    if(a == 0) selector = "*";
    var element = $(selector).filter("rect");

    appendAnimation(line, [{ e: element, p: { attr: { fill: 'purple', class: '+=sorted' } }, o: { duration: 1 } }], codeDisplayManager);
}

function highlightCode(lines) {
    appendCodeLines(lines, codeDisplayManager);
}