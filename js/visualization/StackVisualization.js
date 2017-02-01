var stack;

function initStack(values) {
    $('#stack').empty();

    if (values == null || !(values instanceof Array))
        values = [1, 2, 3, 4, 5];

    stack = new Stack(values);

    animatePushes(values);
}

function pushElement(value) {
    animatePushes(value);
}

function popElement() {
    animatePops(1);
}

function animatePushes(values) {
    var loadingSequence = [];

    if (values == null || !(values instanceof Array)) {
        var tmp = values;
        values = [values];
    }

    for (var i = 0; i < values.length; i++) {
        var currentElement = $('<div class="stack-entry" style="display: none;"><h4 class="stack-value center-align">' + values[i] + '</h4></div>').prependTo('#stack');
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