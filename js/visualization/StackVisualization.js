var stack;
var codeDisplayManager;
var lastElementPopped = null;

$(document).ready(function () {
    if (stack == null) {
        stack = new Stack();
        codeDisplayManager = new CodeDisplayManager("javascript", "stack");
        initStack([1,2,3]);
    }
});

function initStack(array) {
    cleanUpPoppedElement();
    $('#stack').empty();

    stack.arrayList = new ArrayList(array);

    array.forEach(function (value) {
        $('#stack').prepend('<div class="stack-entry red lighten-3 z-depth-3"><h4 class="stack-value center-align truncate noselect">'
            + value + '</h4></div>');
    });
}

function pushElement(value) {
    cleanUpPoppedElement();
    codeDisplayManager.loadFunctions("push");
    codeDisplayManager.changeFunction("push");

    var element = $('<div class="stack-entry red lighten-3 z-depth-3" style="opacity: 0; y: -500px;"><h4 class="stack-value center-align truncate noselect">'
        + value + '</h4></div>').prependTo('#stack');

    appendAnimation(0, [{ e: element, p: [{ y: '-500px' }, { opacity: 1, y: '0', ease: Bounce.easeOut }], o: { duration: 3 } }], codeDisplayManager);
    stack.push(value);
}

function popElement() {
    cleanUpPoppedElement();
    codeDisplayManager.loadFunctions("pop");
    codeDisplayManager.changeFunction("pop");

    var element = $('#stack').children().first();

    var xValue = generateRandomNumberInRange(-100, 100);
    var yValue = generateRandomNumberInRange(-100, -40);
    var directionMovement = pickRandomNumber(-2000, 2000);

    try {
        appendCodeLines([0], codeDisplayManager);
        stack.pop();

        appendAnimation(2, [{ e: element, p: { x: xValue, y: yValue, ease: Power2.easeOut }, o: { duration: 1 } }, 
            { e: element, p: { x: directionMovement, opacity: 0, ease: Power2.easeIn }, o: { duration: 1 } }], codeDisplayManager);

        lastElementPopped = element;
    }
    catch (e) {
        appendCodeLines([1], codeDisplayManager);
        alert(e.message);
    }
}

function cleanUpPoppedElement() {
    if (lastElementPopped != null)
        lastElementPopped.remove();
}

function generateRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function pickRandomNumber() {
    var index = Math.floor(Math.random() * arguments.length)
    return arguments[index];
}

function makeElementsEmpty() {
    animatePops(stack.arrayList.size());
}

function processUploadedObject(object) {
    var arrayList = new ArrayList(object.Stack.arrayList.theItems);
    arrayList.modCount = object.Stack.arrayList.modCount;
    arrayList.theSize = object.Stack.arrayList.theSize;
    arrayList.capacity = object.Stack.arrayList.capacity;
    stack = new Stack();
    stack.arrayList = arrayList;
    initStack(arrayList);
}

$('#download-button, #download-button-mobile').on('click', function () {
    downloadObjectJson(stack);
});