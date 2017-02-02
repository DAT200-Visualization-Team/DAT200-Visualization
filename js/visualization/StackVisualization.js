var stack;

$(document).ready(function () {
    if (stack == null)
        initStack();
});

function initStack(arrayList) {
    $('#stack').empty();

    if (arrayList == null || !(arrayList.constructor.name === 'ArrayList')) {
        arrayList = new ArrayList([1, 2, 3, 4, 5]);
    }

    stack = new Stack();

    animatePushes(arrayList.theItems);
}

function pushElement(value) {
    animatePushes(value);
}

function popElement() {
    animatePops(1);
}

function animatePushes(values) {
    var loadingSequence = [];

    if (values == null)
        values = [null];

    if (!(values instanceof Array)) {
        var tmp = values;
        values = [values];
    }

    for (var i = 0; i < values.length; i++) {
        var currentElement = $('<div class="stack-entry red lighten-3 z-depth-3" style="display: none;"><h4 class="stack-value center-align truncate">' + values[i] + '</h4></div>').prependTo('#stack');
        loadingSequence.push({ e: currentElement, p: 'fadeIn', o: { duration: 1000 } });
        stack.push(values[i]);
    }

    $.Velocity.RunSequence(loadingSequence);
}

function animatePops(count) {
    var loadingSequence = [];

    if (count == null) {
        count = 1;
    }

    for (var i = 0; i < count; i++) {
        var currentElement = $('#stack').children().eq(i);
        loadingSequence.push({ e: currentElement, p: 'fadeOut', o: { duration: 1000, complete: function (elements) { elements[0].remove() } } });
        stack.pop();
    }

    $.Velocity.RunSequence(loadingSequence);
}

function makeElementsEmpty() {
    animatePops(stack.arrayList.size());
}

function processUploadedObject(object) {
    var arrayList = new ArrayList(object.Stack.arrayList.theItems);
    arrayList.modCount = object.Stack.arrayList.modCount;
    arrayList.theSize = object.Stack.arrayList.theSize;
    arrayList.capacity = object.Stack.arrayList.capacity;
    initStack(arrayList);
}

$('#download-button, #download-button-mobile').on('click', function () {
    downloadObjectJson(stack);
});

$('#push-input').keyup(function (event) {
    if (event.keyCode == 13) {
        pushElement($('#push-input').val());
    }
});